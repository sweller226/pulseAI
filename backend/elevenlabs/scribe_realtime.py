from flask import Flask, jsonify, request
from flask_cors import CORS
import asyncio
import sounddevice as sd
import base64
import json
import websockets
import sys
import numpy as np
from queue import Queue
import aiohttp
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import threading
from scipy import signal

app = Flask(__name__)
CORS(app)

# API Keys
ELEVENLABS_API_KEY = "sk_8fb272650773154e31f226b920b97c746720f48d68eb596b"
GEMINI_API_KEY = "AIzaSyAtyhXWkCJNctT1jNHOYA4hac10osTQkSA"

# Initialize ElevenLabs client
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# Audio queue
audio_queue = Queue()

# Global flags
is_listening = True
is_session_active = False
session_result = None

# Conversation state
conversation_state = "INITIAL"

# ==================== AUDIO PREPROCESSING ====================

class AudioPreprocessor:
    """Handles noise reduction and audio enhancement"""
    
    def __init__(self, samplerate=16000):
        self.samplerate = samplerate
        # High-pass filter to remove low-frequency rumble
        self.sos = signal.butter(4, 100, 'hp', fs=samplerate, output='sos')
        
        # Noise gate threshold (adjust if needed)
        self.noise_gate_threshold = 0.01  # Lowered for better sensitivity
        
        # Running average for noise floor estimation
        self.noise_floor = 0.01
        self.noise_floor_alpha = 0.95
    
    def apply_high_pass_filter(self, audio):
        """Remove low-frequency noise"""
        return signal.sosfilt(self.sos, audio, axis=0)
    
    def apply_noise_gate(self, audio):
        """Apply noise gate to reduce background noise"""
        audio_abs = np.abs(audio)
        
        # Update noise floor estimate during quiet periods
        if np.mean(audio_abs) < self.noise_floor * 2:
            self.noise_floor = (self.noise_floor_alpha * self.noise_floor + 
                               (1 - self.noise_floor_alpha) * np.mean(audio_abs))
        
        # Adaptive threshold based on noise floor
        threshold = max(self.noise_gate_threshold, self.noise_floor * 3)
        
        # Apply gate
        mask = audio_abs > threshold
        return audio * mask
    
    def normalize_audio(self, audio):
        """Normalize audio levels"""
        max_val = np.max(np.abs(audio))
        if max_val > 0.001:  # Avoid division by zero
            # Normalize but don't over-amplify
            return audio * min(0.8 / max_val, 3.0)
        return audio
    
    def process(self, audio_chunk):
        """Apply all preprocessing steps"""
        # High-pass filter to remove rumble
        audio = self.apply_high_pass_filter(audio_chunk)
        
        # Apply noise gate
        audio = self.apply_noise_gate(audio)
        
        # Normalize
        audio = self.normalize_audio(audio)
        
        return audio

# Initialize preprocessor
audio_preprocessor = AudioPreprocessor()

def audio_callback(indata, frames, time, status):
    """Audio input callback with preprocessing"""
    if status:
        print(f"Audio status: {status}", file=sys.stderr)
    if is_listening:
        # Apply preprocessing before queueing
        processed_audio = audio_preprocessor.process(indata.copy())
        audio_queue.put(processed_audio)

# ==================== AI FUNCTIONS ====================

async def get_breathing_exercise():
    """Get Gemini to suggest breathing exercises to calm vitals"""
    
    print(f"\n🤔 Getting calming suggestions...")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    system_prompt = """You are a calming medical assistant. The patient has elevated vitals but doesn't want to call anyone.

YOUR TASK: Provide ONE simple breathing exercise or calming technique (2-3 sentences max) to help lower their heart rate and blood pressure.

Example:
"Try taking slow, deep breaths. Breathe in slowly through your nose for 4 counts, hold for 4 counts, then exhale through your mouth for 6 counts. Repeat this for a few minutes."

Keep it simple, calm, and actionable. Maximum 3 sentences."""

    payload = {
        "system_instruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": "Give me a breathing exercise to calm down."}]
            }
        ]
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    ai_response = data['candidates'][0]['content']['parts'][0]['text']
                    
                    print(f"\n🤖 AI: {ai_response}\n")
                    return ai_response
                else:
                    return "Try taking slow, deep breaths. Breathe in through your nose for 4 counts, hold for 4, then exhale through your mouth for 6 counts. This can help lower your heart rate."
                    
    except Exception as e:
        print(f"\n⚠️  Error calling Gemini: {e}\n")
        return "Try taking slow, deep breaths. Breathe in through your nose for 4 counts, hold for 4, then exhale through your mouth for 6 counts. This can help lower your heart rate."

async def handle_patient_choice(text):
    """Handle patient's choice: 911, family, or neither - with fuzzy matching"""
    
    import string
    text_cleaned = text.translate(str.maketrans('', '', string.punctuation))
    text_lower = text_cleaned.lower()
    words = text_lower.split()

    emergency_keywords = {"911", "nine", "emergency", "ambulance", "help"}
    family_keywords = {"family", "contact", "relative", "someone"}
    neither_keywords = {"neither", "no", "none", "dont", "nope", "nothing"}
    
    # Check for emergency - if ANY emergency word appears
    if any(keyword in text_lower for keyword in emergency_keywords) or any(word in emergency_keywords for word in words):
        # Double check it's not "no 911" or "don't call 911"
        if not any(neg in text_lower for neg in ["no 911", "dont call", "not 911", "no emergency"]):
            response = "Calling 911 now. Emergency services are on their way."
            action = "CALL_911"
        else:
            # They said NO to 911, treat as neither
            breathing_exercise = await get_breathing_exercise()
            response = breathing_exercise
            action = "NEITHER"
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "to": "+16473271908",
                    "name": "Emergency Alert",
                    "address": "Patient's home",
                    "incident": "Patient requested 911",
                    "heartrate": "Unknown",
                    "breathing": "Unknown",
                    "emotion": "Distressed",
                    "severity": "High"
                }
                async with session.post(
                    "https://uncondescending-cotemporarily-tinley.ngrok-free.dev/make_call",
                    json=payload,
                    timeout=30
                ) as resp:
                    result = await resp.json()
                    print(f"✓ Emergency call initiated: {result}")
        except Exception as e:
            print(f"⚠️  Error calling emergency API: {e}")
    
    # Check for family - if ANY family word appears
    elif any(keyword in text_lower for keyword in family_keywords) or any(word in family_keywords for word in words):
        response = "Calling your emergency contact now."
        action = "CALL_FAMILY"
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "to": "+14168772102",
                    "name": "Family Alert",
                    "address": "Patient's home",
                    "incident": "Patient needs assistance",
                    "heartrate": "Unknown",
                    "breathing": "Unknown",
                    "emotion": "Concerned",
                    "severity": "Low"
                }
                async with session.post(
                    "https://uncondescending-cotemporarily-tinley.ngrok-free.dev/make_call",
                    json=payload,
                    timeout=30
                ) as resp:
                    result = await resp.json()
                    print(f"✓ Family call initiated: {result}")
        except Exception as e:
            print(f"⚠️  Error calling family API: {e}")
    
    # Check for neither - if ANY neither word appears OR multiple negative words
    elif any(keyword in text_lower for keyword in neither_keywords) or any(word in neither_keywords for word in words):
        breathing_exercise = await get_breathing_exercise()
        response = breathing_exercise
        action = "NEITHER"
    
    # Special case: if they just say a number like "nine" or words are too short/unclear
    elif len(text_lower) < 4:
        response = "I didn't quite catch that. Please say: call 911, call family, or neither."
        action = "CONTINUE"
    
    else:
        # More helpful prompt with examples
        response = "I didn't quite catch that. Please say: call 911, call family, or neither."
        action = "CONTINUE"
    
    print(f"✅ Decision: {action}")
    return response, action

async def speak_response(text):
    """Convert text to speech using ElevenLabs"""
    global is_listening
    
    # Stop listening before speaking
    is_listening = False
    await asyncio.sleep(0.3)  # Increased pause
    
    # Clear audio queue
    while not audio_queue.empty():
        audio_queue.get()
    
    try:
        print(f"🔊 Speaking...")
        
        loop = asyncio.get_event_loop()
        audio = await loop.run_in_executor(
            None,
            lambda: elevenlabs_client.text_to_speech.convert(
                text=text,
                voice_id="JBFqnCBsd6RMkjVDRZzb",
                model_id="eleven_turbo_v2_5",
                output_format="mp3_44100_128",
            )
        )
        
        await loop.run_in_executor(None, play, audio)
        print(f"✓ Done speaking\n")
        
    except Exception as e:
        print(f"⚠️  TTS error: {e}\n")
    
    # Wait before re-enabling listening
    await asyncio.sleep(0.8)  # Increased pause
    
    # Clear any residual audio
    while not audio_queue.empty():
        audio_queue.get()
    
    is_listening = True

# ==================== MAIN EMERGENCY CHECK ====================

async def run_emergency_check():
    """Main emergency check with Hard Limits and Aggressive Detection"""
    global is_listening, conversation_state, session_result, is_session_active
    
    samplerate = 16000
    channels = 1
    blocksize = 1600
    
    ws_url = (
        f"wss://api.elevenlabs.io/v1/speech-to-text/realtime"
        f"?model_id=scribe_v2_realtime"
        f"&audio_format=pcm_16000"
        f"&commit_strategy=vad"
    )
    
    print("🚨 EMERGENCY ALERT TRIGGERED")
    print("Connecting to ElevenLabs...\n")
    
    try:
        async with websockets.connect(
            ws_url,
            extra_headers={"xi-api-key": ELEVENLABS_API_KEY}
        ) as websocket:
            print("✓ Connected to ElevenLabs!\n")
            
            stop_event = asyncio.Event()
            packet_count = 0
            
            # --- INTERNAL HELPERS ---
            
            async def process_text_input(text_to_check, source="final"):
                """Helper to check text and exit if action found"""
                global conversation_state, is_listening, session_result
                
                # Check for action
                response, action = await handle_patient_choice(text_to_check)
                
                # If valid action found (not CONTINUE), execute immediately
                if action in ["CALL_911", "CALL_FAMILY", "NEITHER"]:
                    print(f"\n✅ DECISION MADE ({source}): {action}")
                    print(f"🤖 AI: {response}\n")
                    await speak_response(response)
                    
                    conversation_state = "FINISHED"
                    is_listening = False
                    session_result = {"action": action, "message": response}
                    stop_event.set()
                    return True # Signal to break loop
                
                # If source was a forced timeout check and we still have nothing
                if source == "timeout_force":
                    await handle_no_input()
                    return False
                    
                return False

            async def handle_no_input():
                """Handle cases where time ran out with no clear input"""
                print("\n🚫 No clear input detected.")
                timeout_message = "I didn't hear a clear response. Please say call 911, call family, or neither."
                print(f"\n🤖 AI: {timeout_message}\n")
                await speak_response(timeout_message)
                print(f"🎙️  Listening again...")

            # --- RECEIVE LOOP ---

            async def receive_transcriptions():
                global conversation_state
                last_partial = ""
                
                # TIMERS
                hard_limit_start = None # Starts at listen begin, NEVER resets
                HARD_LIMIT_SECONDS = 7.0
                
                try:
                    async for message in websocket:
                        if conversation_state == "FINISHED":
                            return

                        try:
                            data = json.loads(message)
                            message_type = data.get("message_type")
                            
                            if message_type == "session_started":
                                print(f"✓ Session started!")
                                initial_message = "Your vitals are not normal. You have three options: call 911, call family, or neither."
                                print(f"\n🤖 AI: {initial_message}\n")
                                await speak_response(initial_message)
                                
                                conversation_state = "WAITING_FOR_CHOICE"
                                hard_limit_start = asyncio.get_event_loop().time()
                                print(f"🎙️  Listening (Hard limit: {HARD_LIMIT_SECONDS}s)...")
                                
                            elif message_type == "partial_transcript":
                                text = data.get('text', '')
                                if text.strip() and text != last_partial:
                                    print(f"   You: {text}", end='\r')
                                    sys.stdout.flush()
                                    last_partial = text
                                    
                                    # AGGRESSIVE CHECK: 
                                    # Don't wait for silence. If they say "911", act NOW.
                                    if "911" in text or "nine one one" in text.lower():
                                        if await process_text_input(text, source="aggressive_partial"):
                                            return

                            elif message_type == "committed_transcript":
                                text = data.get('text', '')
                                if text.strip() and conversation_state == "WAITING_FOR_CHOICE":
                                    print(f"\n✓ Committed: {text}")
                                    if await process_text_input(text, source="committed"):
                                        return
                            
                            # --- HARD TIMEOUT CHECK ---
                            # This runs on every message received. 
                            if conversation_state == "WAITING_FOR_CHOICE" and hard_limit_start:
                                current_time = asyncio.get_event_loop().time()
                                
                                # If 7 seconds passed, FORCE a decision based on whatever partial text we have
                                if (current_time - hard_limit_start) > HARD_LIMIT_SECONDS:
                                    print("\n\n⏱️  Hard time limit reached.")
                                    
                                    if last_partial.strip():
                                        print(f"⚠️  Forcing decision on partial text: '{last_partial}'")
                                        if await process_text_input(last_partial, source="timeout_force"):
                                            return
                                    
                                    # If process_text_input returned False (CONTINUE), or no text existed:
                                    if conversation_state != "FINISHED":
                                        if not last_partial.strip():
                                            await handle_no_input()
                                        
                                        # Reset Hard Limit for the retry attempt
                                        hard_limit_start = asyncio.get_event_loop().time()
                        
                        except json.JSONDecodeError:
                            pass
                            
                except Exception as e:
                    print(f"\n⚠️  Receive error: {e}")
            
            # --- AUDIO SENDER ---

            async def send_audio():
                nonlocal packet_count
                try:
                    while not stop_event.is_set():
                        if not audio_queue.empty():
                            audio_chunk = audio_queue.get()
                            # Basic thresholding to prevent sending absolute silence
                            audio_flat = audio_chunk.flatten()
                            audio_int16 = (audio_flat * 32767).astype(np.int16)
                            
                            if np.mean(np.abs(audio_int16)) > 50: 
                                audio_b64 = base64.b64encode(audio_int16.tobytes()).decode("utf-8")
                                packet = {
                                    "message_type": "input_audio_chunk",
                                    "audio_base_64": audio_b64,
                                    "sample_rate": samplerate
                                }
                                await websocket.send(json.dumps(packet))
                        else:
                            await asyncio.sleep(0.01)
                except Exception:
                    pass
            
            # Start tasks
            receive_task = asyncio.create_task(receive_transcriptions())
            
            print("Starting audio stream...")
            with sd.InputStream(samplerate=samplerate, channels=channels, dtype='float32', blocksize=blocksize, callback=audio_callback):
                send_task = asyncio.create_task(send_audio())
                
                # Wait for receiver to finish
                await receive_task
                
                # Cleanup
                stop_event.set()
                send_task.cancel()
                
    except Exception as e:
        print(f"\n⚠️  Error: {e}")
        session_result = {"action": "ERROR", "message": str(e)}
    finally:
        is_session_active = False
        print("🛑 Session ended.")

def run_async_in_thread():
    """Run the async function in a new event loop in a thread"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(run_emergency_check())
    loop.close()

# ==================== FLASK ENDPOINTS ====================

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "online",
        "service": "Emergency Alert Voice Agent",
        "endpoints": {
            "trigger_alert": "/api/trigger-alert [POST]",
            "status": "/api/status [GET]",
            "health": "/ [GET]"
        }
    })

@app.route('/api/trigger-alert', methods=['POST'])
def trigger_alert():
    """Trigger the emergency alert voice agent"""
    global is_session_active, conversation_state, session_result
    
    if is_session_active:
        return jsonify({
            "success": False,
            "message": "Emergency session already in progress"
        }), 409
    
    data = request.get_json() if request.is_json else {}
    patient_id = data.get('patient_id', 'unknown')
    vitals = data.get('vitals', {})
    
    print(f"\n{'='*60}")
    print(f"🚨 EMERGENCY ALERT TRIGGERED via API")
    print(f"Patient ID: {patient_id}")
    print(f"Vitals: {vitals}")
    print(f"{'='*60}\n")
    
    conversation_state = "INITIAL"
    session_result = None
    is_session_active = True
    
    thread = threading.Thread(target=run_async_in_thread, daemon=True)
    thread.start()
    
    return jsonify({
        "success": True,
        "message": "Emergency alert triggered",
        "patient_id": patient_id,
        "session_started": True
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get the current status of the emergency session"""
    global is_session_active, conversation_state, session_result
    
    return jsonify({
        "session_active": is_session_active,
        "conversation_state": conversation_state,
        "result": session_result
    })

@app.route('/api/stop', methods=['POST'])
def stop_session():
    """Manually stop the current emergency session"""
    global is_session_active, session_result
    
    if not is_session_active:
        return jsonify({
            "success": False,
            "message": "No active session to stop"
        }), 400
    
    is_session_active = False
    session_result = {"action": "STOPPED", "message": "Session manually stopped"}
    
    return jsonify({
        "success": True,
        "message": "Session stopped"
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🏥 EMERGENCY ALERT VOICE AGENT SERVER")
    print("="*60)
    print("\nEndpoints:")
    print("  GET  /                    - Health check")
    print("  POST /api/trigger-alert   - Trigger emergency alert")
    print("  GET  /api/status          - Get session status")
    print("  POST /api/stop            - Stop current session")
    print("\nServer starting on http://localhost:8080")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=8080, debug=True)