import socket
import json
import threading
from utils.logger import setup_logger
import config

logger = setup_logger(__name__)

# Store latest vitals data
latest_vitals = {
    "pulse_rate": 0,
    "pulse_confidence": 0.0,
    "breathing_rate": 0,
    "breathing_confidence": 0.0,
    "talking": False,
    "timestamp": None,
    "status": "waiting"
}

# Thread lock for vitals data
vitals_lock = threading.Lock()

# VitalsMonitor instance (set by main.py)
vitals_monitor = None

def set_vitals_monitor(monitor):
    """Set the vitals monitor instance"""
    global vitals_monitor
    vitals_monitor = monitor
    logger.info("VitalsMonitor connected to socket server")

def validate_vitals(vitals: dict) -> bool:
    """
    Validate vitals data structure and ranges
    
    Args:
        vitals: Dictionary with vitals data
    
    Returns:
        True if valid, False otherwise
    """
    required_fields = ['pulse_rate', 'breathing_rate', 'pulse_confidence', 'breathing_confidence']
    
    # Check required fields
    for field in required_fields:
        if field not in vitals:
            logger.warning(f"Missing required field: {field}")
            return False
    
    # Check data types and ranges
    try:
        pulse = int(vitals['pulse_rate'])
        breathing = int(vitals['breathing_rate'])
        pulse_conf = float(vitals['pulse_confidence'])
        breathing_conf = float(vitals['breathing_confidence'])
        
        # Sanity checks (very wide ranges to catch obvious errors)
        if not (0 <= pulse <= 300):
            logger.warning(f"Pulse out of range: {pulse}")
            return False
        
        if not (0 <= breathing <= 100):
            logger.warning(f"Breathing out of range: {breathing}")
            return False
        
        if not (-3.0 <= pulse_conf <= 3.0):
            logger.warning(f"Pulse confidence out of range: {pulse_conf}")
            return False
        
        if not (-3.0 <= breathing_conf <= 3.0):
            logger.warning(f"Breathing confidence out of range: {breathing_conf}")
            return False
        
        return True
    
    except (ValueError, TypeError) as e:
        logger.warning(f"Invalid data types: {e}")
        return False


def socket_server():
    """Background thread to receive vitals data from SmartSpectra (WSL)"""
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((config.SOCKET_HOST, config.SOCKET_PORT))
    server_socket.listen(1)
    
    logger.info(f"Socket server listening on {config.SOCKET_HOST}:{config.SOCKET_PORT}")
    logger.info(f"SmartSpectra should connect to: 172.26.64.1:{config.SOCKET_PORT}")
    
    while True:
        try:
            conn, addr = server_socket.accept()
            logger.info(f"Connection from {addr}")
            
            buffer = ""
            while True:
                data = conn.recv(1024).decode('utf-8')
                if not data:
                    break
                
                logger.debug(f"Raw data received: {data}")
                
                buffer += data
                while '\n' in buffer:
                    line, buffer = buffer.split('\n', 1)
                    logger.debug(f"Processing line: {line}")
                    
                    try:
                        vitals = json.loads(line)
                        
                        # Validate vitals data
                        if not validate_vitals(vitals):
                            logger.warning("Invalid vitals data - skipping")
                            continue
                        
                        # Update stored vitals (thread-safe)
                        with vitals_lock:
                            latest_vitals.update(vitals)
                            latest_vitals['status'] = 'active'
                        
                        logger.info(f"✓ Vitals - Pulse: {vitals.get('pulse_rate')} BPM "
                                   f"(conf: {vitals.get('pulse_confidence'):.2f}), "
                                   f"Breathing: {vitals.get('breathing_rate')} BPM "
                                   f"(conf: {vitals.get('breathing_confidence'):.2f}), "
                                   f"Talking: {vitals.get('talking')}")
                        
                        # Check with vitals monitor
                        if vitals_monitor:
                            vitals_monitor.check_vitals(vitals)
                    
                    except json.JSONDecodeError as e:
                        logger.error(f"✗ Invalid JSON: {line} - Error: {e}")
            
            conn.close()
            logger.info("Connection closed")
        
        except Exception as e:
            logger.error(f"Socket error: {e}", exc_info=True)


def start_socket_server():
    """Start socket server in background thread"""
    socket_thread = threading.Thread(target=socket_server, daemon=True)
    socket_thread.start()
    logger.info("Socket server thread started")
    return socket_thread


def get_latest_vitals():
    """Get the latest vitals data (thread-safe)"""
    with vitals_lock:
        return latest_vitals.copy()
