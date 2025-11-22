from flask import Flask
from flask_cors import CORS
from socket_server import start_socket_server
from routes import register_routes
from visualizer_gui import start_gui
from emotion_analyzer import start_emotion_analysis
import sys
import time
import argparse

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

# Parse command line arguments
parser = argparse.ArgumentParser(description='Flask server with optional GUI visualizer')
parser.add_argument('--gui', action='store_true', help='Launch GUI visualizer')
parser.add_argument('--camera', type=int, default=0, help='Camera index (default: 0)')
parser.add_argument('--no-fer', action='store_true', help='Disable FER emotion detection')
args = parser.parse_args()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Start socket server in background
print("Starting socket server...")
start_socket_server()
time.sleep(0.5)  # Give socket server time to bind
print("Socket server started")

# Start emotion analysis from webcam
if not args.no_fer:
    print(f"Starting emotion analysis from camera {args.camera}...")
    if start_emotion_analysis(camera_index=args.camera):
        print("✓ Emotion analysis running")
    else:
        print("⚠ Emotion analysis not available")
else:
    print("⚠ FER emotion detection disabled (--no-fer flag)")

# Register routes
register_routes(app)

# Start GUI if requested
if args.gui:
    print("Starting GUI visualizer...")
    start_gui()
    time.sleep(0.5)
    print("GUI visualizer started")

if __name__ == '__main__':
    print("Starting Flask server on http://0.0.0.0:5000")
    print("Ready to accept SmartSpectra connections on port 5555")
    print("Emotion detection running from webcam")
    if args.gui:
        print("GUI visualizer is running - close the window to stop")
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)