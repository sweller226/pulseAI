import socket
import json
import threading

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

# Socket server configuration
SOCKET_HOST = '0.0.0.0'
SOCKET_PORT = 5555

def socket_server():
    """Background thread to receive vitals data from SmartSpectra (WSL)"""
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((SOCKET_HOST, SOCKET_PORT))
    server_socket.listen(1)
    
    print(f"Socket server listening on {SOCKET_HOST}:{SOCKET_PORT}")
    print(f"SmartSpectra should connect to: 172.26.64.1:{SOCKET_PORT}")
    
    while True:
        try:
            conn, addr = server_socket.accept()
            print(f"Connection from {addr}")
            
            buffer = ""
            while True:
                data = conn.recv(1024).decode('utf-8')
                if not data:
                    break
                
                print(f"Raw data received: {data}")
                
                buffer += data
                while '\n' in buffer:
                    line, buffer = buffer.split('\n', 1)
                    print(f"Processing line: {line}")
                    try:
                        vitals = json.loads(line)
                        # Update stored vitals
                        latest_vitals.update(vitals)
                        latest_vitals['status'] = 'active'
                        
                        print(f"✓ Parsed vitals: Pulse={vitals.get('pulse_rate')} BPM (conf: {vitals.get('pulse_confidence'):.2f}), "
                              f"Breathing={vitals.get('breathing_rate')} BPM (conf: {vitals.get('breathing_confidence'):.2f}), "
                              f"Talking={vitals.get('talking')}")
                    except json.JSONDecodeError as e:
                        print(f"✗ Invalid JSON: {line} - Error: {e}")
            
            conn.close()
            print("Connection closed")
        except Exception as e:
            print(f"Socket error: {e}")

def start_socket_server():
    """Start socket server in background thread"""
    socket_thread = threading.Thread(target=socket_server, daemon=True)
    socket_thread.start()
    return socket_thread

def get_latest_vitals():
    """Get the latest vitals data"""
    return latest_vitals.copy()
