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


def generate_ai_message_emergency(name, address, incident, heartrate, breathing, emotion):
    prompt = (
        f"You are an AI healthcare assistant monitoring a patient. "
        f"Report an emergency to a responder with the following details:\n"
        f"Patient Name: {name}\n"
        f"Patient Address: {address}\n"
        f"Emergency Incident: {incident}\n"
        f"Heartrate: {heartrate}\n"
        f"Breathing: {breathing}\n"
        f"Observed Emotion: {emotion}\n"
        f"Speak clearly, calmly, and professionally as an AI assistant."
    )
    try:
        response = client.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating AI message: {e}")
        return (
            f"This is an emergency call for {name} at {address}. "
            f"Incident: {incident}. "
            f"Heartrate: {heartrate}, Breathing: {breathing}, Emotion: {emotion}."
        )
    
def generate_ai_message_family(name, address, incident, heartrate, breathing, emotion):
    prompt = (
        f"You are an AI healthcare assistant monitoring a patient. "
        f"Report an incident to a family member with the following details:\n"
        f"Patient Name: {name}\n"
        f"Patient Address: {address}\n"
        f"Emergency Incident: {incident}\n"
        f"Heartrate: {heartrate}\n"
        f"Breathing: {breathing}\n"
        f"Observed Emotion: {emotion}\n"
        f"Speak clearly, calmly, and professionally as an AI assistant."
    )
    try:
        response = client.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating AI message: {e}")
        return (
            f"This is a call for {name} at {address}. "
            f"Incident: {incident}. "
            f"Heartrate: {heartrate}, Breathing: {breathing}, Emotion: {emotion}."
        )