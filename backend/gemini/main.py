from flask import Flask
from flask_cors import CORS
from socket_server import start_socket_server, set_vitals_monitor
from routes import register_routes
from visualizer_gui import start_gui
from emotion_analyzer import start_emotion_analysis
from services.vitals_monitor import VitalsMonitor
from services.alert_manager import AlertManager
from utils.logger import setup_logger
import config
import sys
import time
import argparse

# Setup logging
logger = setup_logger(__name__)

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

# Parse command line arguments
parser = argparse.ArgumentParser(description='PulseAI - Vital Signs Monitoring with Alert System')
parser.add_argument('--gui', action='store_true', help='Launch GUI visualizer')
parser.add_argument('--camera', type=int, default=0, help='Camera index (default: 0)')
parser.add_argument('--no-fer', action='store_true', help='Disable FER emotion detection')
args = parser.parse_args()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

logger.info("=" * 60)
logger.info("PulseAI - Vital Signs Alert System")
logger.info("=" * 60)

# Initialize Alert Manager
alert_manager = AlertManager()
logger.info("✓ AlertManager initialized")

# Initialize Vitals Monitor with alert callback
vitals_monitor = VitalsMonitor(alert_callback=alert_manager.trigger_alert)
logger.info("✓ VitalsMonitor initialized")

# Start socket server in background
logger.info("Starting socket server...")
start_socket_server()
time.sleep(0.5)  # Give socket server time to bind

# Connect vitals monitor to socket server
set_vitals_monitor(vitals_monitor)
logger.info("✓ Socket server started and connected to VitalsMonitor")

# Start emotion analysis from webcam
if not args.no_fer:
    logger.info(f"Starting emotion analysis from camera {args.camera}...")
    if start_emotion_analysis(camera_index=args.camera):
        logger.info("✓ Emotion analysis running")
    else:
        logger.warning("⚠ Emotion analysis not available")
else:
    logger.warning("⚠ FER emotion detection disabled (--no-fer flag)")

# Register routes (pass alert_manager for API access)
register_routes(app, alert_manager, vitals_monitor)
logger.info("✓ API routes registered")

# Start GUI if requested
if args.gui:
    logger.info("Starting GUI visualizer...")
    start_gui()
    time.sleep(0.5)
    logger.info("✓ GUI visualizer started")

if __name__ == '__main__':
    logger.info("=" * 60)
    logger.info(f"Flask API running on http://{config.FLASK_HOST}:{config.FLASK_PORT}")
    logger.info(f"SmartSpectra connects to port {config.SOCKET_PORT}")
    logger.info(f"Alert thresholds: Pulse {config.PULSE_MIN}-{config.PULSE_MAX}, Breathing {config.BREATHING_MIN}-{config.BREATHING_MAX}")
    logger.info(f"Alert triggers after {config.ABNORMAL_DURATION_THRESHOLD}s of abnormal vitals")
    if args.gui:
        logger.info("GUI visualizer is running")
    logger.info("=" * 60)
    logger.info("System ready! Monitoring vitals...")
    
    app.run(host=config.FLASK_HOST, port=config.FLASK_PORT, debug=True, use_reloader=False)