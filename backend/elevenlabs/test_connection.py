"""
Simple test to verify ElevenLabs connection works
Run this to test if your API key and network connection are working
"""
import asyncio
import websockets
import os
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

async def test_connection():
    ws_url = (
        f"wss://api.elevenlabs.io/v1/speech-to-text/realtime"
        f"?model_id=scribe_v2_realtime"
        f"&audio_format=pcm_16000"
        f"&commit_strategy=vad"
    )
    
    print("Testing ElevenLabs connection...")
    print(f"API Key: {ELEVENLABS_API_KEY[:20]}..." if ELEVENLABS_API_KEY else "No API key!")
    print(f"Connecting to: {ws_url[:50]}...")
    
    try:
        async with websockets.connect(
            ws_url,
            extra_headers={"xi-api-key": ELEVENLABS_API_KEY},
            open_timeout=10
        ) as websocket:
            print("✅ Connected successfully!")
            
            # Wait for session_started message
            message = await websocket.recv()
            print(f"✅ Received: {message[:100]}...")
            
            print("\n✅ ElevenLabs connection works!")
            return True
            
    except asyncio.TimeoutError:
        print("❌ Connection timed out!")
        print("Possible issues:")
        print("  - Firewall blocking WebSocket connections")
        print("  - Network proxy issues")
        print("  - ElevenLabs API is down")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_connection())
    if not result:
        print("\n💡 Try:")
        print("  1. Check your internet connection")
        print("  2. Disable VPN/proxy temporarily")
        print("  3. Check Windows Firewall settings")
        print("  4. Verify API key is correct")
