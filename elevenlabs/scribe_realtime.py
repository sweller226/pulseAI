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
GEMINI_API_KEY = "AIzaSyAtyhXWkCJNctT1jNHOYA4hac10osTQkSA"  # Get from https://aistudio.google.com/app/apikey

# Initialize ElevenLabs client
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# Audio queue
audio_queue = Queue()

# Conversation history
conversation_history = []

def audio_callback(indata, frames, time, status):
    """Audio input callback"""
    if status:
        print(f"Audio status: {status}", file=sys.stderr)
    audio_queue.put(indata.copy())

async def send_to_gemini(user_message):
    """Send message to Gemini and get response"""
    global is_listening
    
    print(f"\n🤔 Thinking...")
    
    # Add user message to history
    conversation_history.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })
    
    # Gemini API endpoint - using v1beta (supports system_instruction)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    # Request payload with system instruction for SHORT responses
    payload = {
        "system_instruction": {
            "parts": [{
                "text": "You are a helpful medical assistant. Keep responses SHORT - maximum 2-3 sentences. Be direct and actionable. No long lists or explanations."
            }]
        },
        "contents": conversation_history
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Extract the response text
                    ai_response = data['candidates'][0]['content']['parts'][0]['text']
                    
                    # Add AI response to history
                    conversation_history.append({
                        "role": "model",
                        "parts": [{"text": ai_response}]
                    })
                    
                    print(f"\n🤖 AI: {ai_response}\n")
                    
                    # PAUSE LISTENING while AI speaks
                    is_listening = False
                    
                    # Give a moment for the flag to take effect
                    await asyncio.sleep(0.2)
                    
                    # Clear any audio that accumulated
                    while not audio_queue.empty():
                        audio_queue.get()
                    
                    print(f"🔊 Speaking...")
                    await speak_response(ai_response)
                    print(f"✓ Done speaking\n")
                    
                    # Wait a moment after speech ends
                    await asyncio.sleep(0.5)
                    
                    # Clear any audio that accumulated during speech
                    while not audio_queue.empty():
                        audio_queue.get()
                    
                    # RESUME LISTENING
                    is_listening = True
                    print(f"🎙️  Listening...\n")
                    
                    return ai_response
                else:
                    error_text = await response.text()
                    print(f"\n⚠️  Gemini API error ({response.status}): {error_text}\n")
                    return None
                    
    except Exception as e:
        print(f"\n⚠️  Error calling Gemini: {e}\n")
        return None

async def speak_response(text):
    """Convert AI response to speech using ElevenLabs"""
    try:
        # Run blocking TTS call in thread pool to not block async loop
        loop = asyncio.get_event_loop()
        audio = await loop.run_in_executor(
            None,
            lambda: elevenlabs_client.text_to_speech.convert(
                text=text,
                voice_id="JBFqnCBsd6RMkjVDRZzb",  # Rachel voice
                model_id="eleven_turbo_v2_5",  # Fast model for real-time
                output_format="mp3_44100_128",
            )
        )
        
        # Play the audio (also blocking, so run in executor)
        await loop.run_in_executor(None, play, audio)
        
    except Exception as e:
        print(f"⚠️  TTS error: {e}\n")

async def main():
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
    
    print("Connecting to ElevenLabs...")
    
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
                                print(f"🎙️  Start speaking! (I'll respond after 1.5s of silence)\n")
                                
                            elif message_type == "partial_transcript":
                                # Show live transcription
                                text = data.get('text', '')
                                if text.strip():
                                    print(f"   You: {text}", end='\r')
                                    sys.stdout.flush()
                                    
                            elif message_type == "committed_transcript":
                                # This is the complete sentence!
                                text = data.get('text', '')
                                if text.strip():
                                    print(f"\n✅ You: {text}")
                                    
                                    # THIS IS WHERE WE SEND TO GEMINI!
                                    await send_to_gemini(text)
                                    
                                    print(f"🎙️  Listening...\n")
                                    
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
                            
                            # Status indicator
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

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
    print("\n✓ Conversation ended!")
    
    # Print conversation summary
    if conversation_history:
        print("\n📝 Conversation Summary:")
        print("=" * 50)
        for msg in conversation_history:
            role = "You" if msg["role"] == "user" else "AI"
            text = msg["parts"][0]["text"]
            print(f"{role}: {text}")
        print("=" * 50)