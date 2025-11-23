# Vital Signs Thresholds
PULSE_MIN = 50
PULSE_MAX = 120
BREATHING_MIN = 10
BREATHING_MAX = 25
CONFIDENCE_THRESHOLD = 0.7

# Alert Settings
ABNORMAL_DURATION_THRESHOLD = 3.0  # seconds - must be abnormal for this long to trigger
ALERT_COOLDOWN_PERIOD = 300  # 5 minutes - prevent duplicate alerts

# Network Configuration
SOCKET_HOST = "0.0.0.0"
SOCKET_PORT = 5555
FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
