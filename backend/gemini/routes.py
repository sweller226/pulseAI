from flask import jsonify, request
from socket_server import get_latest_vitals
from gemini_service import analyze_vitals, chat_with_gemini
from emotion_analyzer import get_current_emotion, get_emotion_summary
from utils.logger import setup_logger
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
from dotenv import load_dotenv
from gemini_service import generate_ai_message_emergency, generate_ai_message_family
import os

logger = setup_logger(__name__)

def register_routes(app, alert_manager, vitals_monitor):
    """Register all Flask routes"""
    # ===== VITALS ENDPOINTS =====
    @app.route('/api/vitals/current', methods=['GET'])
    def get_current_vitals():
        """Get latest vitals data with emotion analysis and alert status"""
        vitals = get_latest_vitals()
        emotion_data = get_current_emotion()
        if emotion_data:
            vitals['emotion'] = emotion_data
            vitals['emotion_summary'] = emotion_data.get('dominant', 'unknown')
        active_alert = alert_manager.get_active_alert()
        vitals['alert_active'] = active_alert is not None
        if active_alert:
            vitals['alert_id'] = active_alert['id']
        monitor_status = vitals_monitor.get_status()
        vitals['is_abnormal'] = monitor_status['is_abnormal']
        vitals['abnormal_duration'] = monitor_status['abnormal_duration']
        return jsonify(vitals)

    # ===== ALERT ENDPOINTS =====
    @app.route('/api/alerts/active', methods=['GET'])
    def get_active_alert():
        """Get currently active alert (if any)"""
        active_alert = alert_manager.get_active_alert()
        if not active_alert:
            return jsonify({
                "alert_active": False,
                "message": "No active alert"
            })
        return jsonify({
            "alert_active": True,
            "alert": active_alert
        })

    @app.route('/api/emergency/test-trigger', methods=['POST'])
    def test_trigger_alert():
        """Manually trigger an alert for testing"""
        logger.warning("Manual alert trigger requested via API")
        vitals = get_latest_vitals()
        if vitals.get('status') != 'active':
            vitals = {
                'pulse_rate': 150,
                'breathing_rate': 30,
                'pulse_confidence': 0.9,
                'breathing_confidence': 0.9,
                'talking': False,
                'timestamp': None,
                'status': 'test'
            }
            logger.info("Using test vitals data for manual trigger")
        success = alert_manager.trigger_alert(vitals)
        if success:
            return jsonify({
                "success": True,
                "message": "Alert triggered successfully",
                "vitals": vitals
            })
        else:
            return jsonify({
                "success": False,
                "message": "Alert blocked (already active or in cooldown)",
                "vitals": vitals
            }), 400

    @app.route('/health', methods=['GET'])
    def health():
        """Health check endpoint"""
        vitals = get_latest_vitals()
        active_alert = alert_manager.get_active_alert()
        return jsonify({
            "status": "ok",
            "vitals_status": vitals['status'],
            "alert_active": active_alert is not None,
            "monitoring": "active"
        })

    logger.info("✓ All API routes registered")

    # ===== TWILIO PHONE CALL ENDPOINTS =====
    load_dotenv()
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    greetings = {}

    @app.route('/')
    def home():
        return jsonify({
            "message": "AI-Powered Phone Call API",
        })

    @app.route('/make_call', methods=['POST'])
    def make_call():
        data = request.get_json()
        if not data or 'to' not in data:
            return jsonify({"error": "Missing 'to' phone number"}), 400
        to_number = data['to']
        name = data.get('name', 'John Doe')
        address = data.get('address', '123 Main St')
        incident = data.get('incident', 'Asthma Attack')
        heartrate = data.get('heartrate', '110 bpm')
        breathing = data.get('breathing', 'Rapid')
        emotion = data.get('emotion', 'Distress')
        severity = data.get('severity', 'High')
        if (severity == 'High'):
            greeting = generate_ai_message_emergency(
                name=name,
                address=address,
                incident=incident,
                heartrate=heartrate,
                breathing=breathing,
                emotion=emotion
            )
        else:
            greeting = generate_ai_message_family(
                name=name,
                address=address,
                incident=incident,
                heartrate=heartrate,
                breathing=breathing,
                emotion=emotion
            )
        webhook_url = data.get('webhook_url', request.url_root.rstrip('/') + '/voice')
        print(f"Initiating call to {to_number}...")
        call = client.calls.create(
            to=to_number,
            from_=TWILIO_PHONE_NUMBER,
            url=webhook_url,
            method='POST'
        )
        greetings[call.sid] = greeting
        return jsonify({
            "success": True,
            "call_sid": call.sid,
            "to": to_number,
            "status": call.status,
            "greeting": greeting
        }), 200

    @app.route('/voice', methods=['GET', 'POST'])
    def voice():
        response = VoiceResponse()
        call_sid = request.values.get('CallSid')
        greeting_text = greetings.get(call_sid) or "Hello! This is an automated call. Thank you for answering."
        print(f"TwiML Response sent: {greeting_text}")
        response.say(greeting_text, voice='alice', language='en-US')
        response.pause(length=1)
        response.say("Thank you for your time. Goodbye!", voice='alice', language='en-US')
        response.hangup()
        return str(response), 200, {'Content-Type': 'text/xml'}