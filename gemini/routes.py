from flask import jsonify, request
from socket_server import get_latest_vitals
from gemini_service import analyze_vitals, chat_with_gemini
from emotion_analyzer import get_current_emotion, get_emotion_summary

def register_routes(app):
    """Register all Flask routes"""
    
    @app.route('/vitals', methods=['GET'])
    def get_vitals():
        """Get latest vitals data with emotion analysis from webcam"""
        vitals = get_latest_vitals()
        
        # Add emotion analysis from webcam (not landmarks)
        emotion_data = get_current_emotion()
        if emotion_data:
            vitals['emotion'] = emotion_data
            vitals['emotion_summary'] = emotion_data.get('dominant', 'unknown')
        
        return jsonify(vitals)
    
    @app.route('/emotion', methods=['GET'])
    def get_emotion():
        """Get just the emotion analysis from webcam"""
        emotion_data = get_current_emotion()
        
        if not emotion_data:
            return jsonify({"error": "No emotion data available - check if webcam is accessible"}), 400
        
        return jsonify({
            "emotion": emotion_data,
            "summary": emotion_data.get('dominant', 'unknown'),
            "confidence": emotion_data.get('confidence', 0),
            "timestamp": emotion_data.get('timestamp')
        })
    
    @app.route('/analyze', methods=['POST'])
    def analyze():
        """Analyze vitals using Gemini AI"""
        try:
            data = request.json
            
            if data:
                pulse = data.get('pulse')
                breathing = data.get('breathing')
            else:
                vitals = get_latest_vitals()
                pulse = vitals.get('pulse')
                breathing = vitals.get('breathing')
            
            if pulse is None or breathing is None:
                return jsonify({"error": "No vitals data available"}), 400
            
            analysis = analyze_vitals(pulse, breathing)
            
            return jsonify({
                "vitals": {
                    "pulse": pulse,
                    "breathing": breathing
                },
                "analysis": analysis
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/chat', methods=['POST'])
    def chat():
        """Chat with Gemini AI"""
        try:
            data = request.json
            message = data.get('message', '')
            
            if not message:
                return jsonify({"error": "No message provided"}), 400
            
            response = chat_with_gemini(message)
            
            return jsonify({
                "message": message,
                "response": response
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/health', methods=['GET'])
    def health():
        """Health check endpoint"""
        vitals = get_latest_vitals()
        return jsonify({
            "status": "ok",
            "vitals_status": vitals['status']
        })
