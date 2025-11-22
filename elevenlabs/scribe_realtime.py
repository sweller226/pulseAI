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

# API Keys
ELEVENLABS_API_KEY = "sk_8fb272650773154e31f226b920b97c746720f48d68eb596b"
GEMINI_API_KEY = "AIzaSyAtyhXWkCJNctT1jNHOYA4hac10osTQkSA"

# Initialize ElevenLabs client
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# Audio queue
audio_queue = Queue()

# Global flag for listening state
is_listening = True

# Conversation state
conversation_state = "INITIAL"  # INITIAL -> WAITING_FOR_CHOICE

def audio_callback(indata, frames, time, status):
    """Audio input callback"""
    if status:
        print(f"Audio status: {status}", file=sys.stderr)
    if is_listening:
        audio_queue.put(indata.copy())

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
                    # Fallback breathing exercise
                    return "Try taking slow, deep breaths. Breathe in through your nose for 4 counts, hold for 4, then exhale through your mouth for 6 counts. This can help lower your heart rate."
                    
    except Exception as e:
        print(f"\n⚠️  Error calling Gemini: {e}\n")
        # Fallback breathing exercise
        return "Try taking slow, deep breaths. Breathe in through your nose for 4 counts, hold for 4, then exhale through your mouth for 6 counts. This can help lower your heart rate."

async def handle_patient_choice(text):
    """Handle patient's choice: 911, family, or neither"""
    
    text_lower = text.lower()
    
    # Check for 911
    if "911" in text_lower or "emergency" in text_lower or "ambulance" in text_lower:
        response = "Calling 911 now. Emergency services are on their way."
        action = "CALL_911"
    
    # Check for family
    elif "family" in text_lower or "contact" in text_lower:
        response = "Calling your emergency contact now."
        action = "CALL_FAMILY"
    
    # Check for neither
    elif "neither" in text_lower or "no" in text_lower or "none" in text_lower or "don't" in text_lower:
        # Get breathing exercise from Gemini
        breathing_exercise = await get_breathing_exercise()
        response = breathing_exercise
        action = "NEITHER"
    
    # Unclear response - ask again
    else:
        response = "I didn't catch that. Please say call 911, call family, or neither."
        action = "CONTINUE"
    
    return response, action

async def speak_response(text):
    """Convert text to speech using ElevenLabs"""
    global is_listening
    
    # PAUSE LISTENING while AI speaks
    is_listening = False
    await asyncio.sleep(0.2)
    
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
                voice_id="JBFqnCBsd6RMkjVDRZzb",  # Rachel voice
                model_id="eleven_turbo_v2_5",
                output_format="mp3_44100_128",
            )
        )
        
        await loop.run_in_executor(None, play, audio)
        print(f"✓ Done speaking\n")
        
    except Exception as e:
        print(f"⚠️  TTS error: {e}\n")
    
    await asyncio.sleep(0.5)
    
    # Clear audio again
    while not audio_queue.empty():
        audio_queue.get()
    
    # RESUME LISTENING
    is_listening = True

async def main():
    """Main function - triggered from frontend when alert happens"""
    global is_listening, conversation_state
    
    samplerate = 16000
    channels = 1
    blocksize = 1600  # 100ms at 16kHz
    
    # Test microphone
    print("Testing microphone... Say something for 2 seconds!")
    test_audio = sd.rec(int(2.0 * samplerate), samplerate=samplerate, channels=channels, dtype="int16")
    sd.wait()
    print(f"✓ Audio captured! Mean level: {np.mean(np.abs(test_audio)):.0f}\n")
    
    # WebSocket URL
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
            additional_headers={"xi-api-key": ELEVENLABS_API_KEY}
        ) as websocket:
            print("✓ Connected to ElevenLabs!\n")
            
            stop_event = asyncio.Event()
            packet_count = 0
            
            # Task to receive transcriptions
            async def receive_transcriptions():
                try:
                    async for message in websocket:
                        try:
                            data = json.loads(message)
                            message_type = data.get("message_type")
                            
                            if message_type == "session_started":
                                print(f"✓ Session started!")
                                
                                # AI speaks first with hardcoded message
                                initial_message = "Your vitals are not normal. You have three options: call 911, call family, or neither."
                                print(f"\n🤖 AI: {initial_message}\n")
                                await speak_response(initial_message)
                                
                                conversation_state = "WAITING_FOR_CHOICE"
                                print(f"🎙️  Listening for your choice...\n")
                                
                            elif message_type == "partial_transcript":
                                text = data.get('text', '')
                                if text.strip():
                                    print(f"   You: {text}", end='\r')
                                    sys.stdout.flush()
                                    
                            elif message_type == "committed_transcript":
                                text = data.get('text', '')
                                if text.strip() and conversation_state == "WAITING_FOR_CHOICE":
                                    print(f"\n✅ You said: {text}")
                                    
                                    # Process the choice
                                    response, action = await handle_patient_choice(text)
                                    
                                    print(f"\n🤖 AI: {response}\n")
                                    await speak_response(response)
                                    
                                    if action == "CALL_911":
                                        print("\n🚨 ACTION: CALLING 911\n")
                                        print("=" * 50)
                                        print(">>> TRIGGER: Call 911 from your system here <<<")
                                        print("=" * 50)
                                        stop_event.set()
                                        
                                    elif action == "CALL_FAMILY":
                                        print("\n📞 ACTION: CALLING FAMILY\n")
                                        print("=" * 50)
                                        print(">>> TRIGGER: Call family from your system here <<<")
                                        print("=" * 50)
                                        stop_event.set()
                                    
                                    elif action == "NEITHER":
                                        print("\n🧘 ACTION: PROVIDED BREATHING EXERCISE\n")
                                        print("=" * 50)
                                        print(">>> Patient chose self-calming - monitor vitals <<<")
                                        print("=" * 50)
                                        stop_event.set()
                                    
                                    # If CONTINUE, loop continues waiting for valid response
                                    
                            elif message_type == "input_error":
                                print(f"⚠️  INPUT ERROR: {data.get('error')}")
                            elif message_type == "error":
                                print(f"⚠️  ERROR: {data.get('message', data)}")
                                
                        except json.JSONDecodeError:
                            pass
                            
                except websockets.exceptions.ConnectionClosed:
                    pass
                except Exception as e:
                    print(f"\n⚠️  Receive error: {e}")
            
            # Task to send audio
            async def send_audio():
                nonlocal packet_count
                try:
                    while not stop_event.is_set():
                        if not audio_queue.empty():
                            audio_chunk = audio_queue.get()
                            
                            # Convert float32 to int16
                            audio_flat = audio_chunk.flatten()
                            audio_int16 = (audio_flat * 32767).astype(np.int16)
                            audio_level = np.mean(np.abs(audio_int16))
                            
                            # Encode and send
                            audio_b64 = base64.b64encode(audio_int16.tobytes()).decode("utf-8")
                            packet = {
                                "message_type": "input_audio_chunk",
                                "audio_base_64": audio_b64,
                                "sample_rate": samplerate
                            }
                            
                            await websocket.send(json.dumps(packet))
                            packet_count += 1
                            
                            if packet_count % 50 == 0:
                                if audio_level > 100:
                                    print(f"[🔊 {packet_count} packets]", end='\r')
                                    sys.stdout.flush()
                        else:
                            await asyncio.sleep(0.01)
                        
                except asyncio.CancelledError:
                    print(f"\n✓ Sent {packet_count} total packets")
                    raise
            
            # Start tasks
            receive_task = asyncio.create_task(receive_transcriptions())
            
            # Start audio stream
            print("Starting audio stream...")
            with sd.InputStream(
                samplerate=samplerate,
                channels=channels,
                dtype='float32',
                blocksize=blocksize,
                callback=audio_callback
            ):
                print("✓ Audio stream active\n")
                send_task = asyncio.create_task(send_audio())
                
                try:
                    await asyncio.gather(send_task, receive_task)
                except KeyboardInterrupt:
                    print("\n\n⏹  Stopping...")
                    stop_event.set()
                    send_task.cancel()
                    receive_task.cancel()
                    await asyncio.gather(send_task, receive_task, return_exceptions=True)
                    
    except Exception as e:
        print(f"\n⚠️  Error: {e}")
        import traceback
        traceback.print_exc()

# Function to trigger from frontend
def trigger_emergency_check():
    """
    Call this function from your frontend when red alert is triggered
    No parameters needed - just triggers the voice agent
    """
    global conversation_state
    conversation_state = "INITIAL"
    
    # Run the async main function
    asyncio.run(main())

if __name__ == "__main__":
    try:
        print("=" * 60)
        print("SIMULATING EMERGENCY ALERT FROM FRONTEND")
        print("=" * 60)
        
        # Just call the function - no data needed
        trigger_emergency_check()
        
    except KeyboardInterrupt:
        pass
    print("\n✓ Emergency assessment complete!")