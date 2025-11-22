import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Initialize Gemini client
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

def analyze_vitals(pulse, breathing):
    """Analyze vitals using Gemini AI"""
    prompt = f"""Analyze these vital signs:
- Heart Rate: {pulse} BPM
- Breathing Rate: {breathing} BPM

Provide a brief health assessment and any recommendations."""
    
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    
    return response.text

def chat_with_gemini(message):
    """General chat with Gemini"""
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=message
    )
    
    return response.text
