#!/usr/bin/env python3
"""
Demo script to test the AI-powered phone call API.
"""
import requests
import json

def make_test_call(to_number, name=None, address=None, incident=None, heartrate=None, breathing=None, emotion=None, webhook_url=None):
    """
    Make a test phone call using the API.
    """
    api_url = "https://uncondescending-cotemporarily-tinley.ngrok-free.dev/make_call"
    data = {"to": to_number}
    if name: data["name"] = name
    if address: data["address"] = address
    if incident: data["incident"] = incident
    if heartrate: data["heartrate"] = heartrate
    if breathing: data["breathing"] = breathing
    if emotion: data["emotion"] = emotion
    if webhook_url: data["webhook_url"] = webhook_url

    print(f"\n🤖 AI Phone Call Demo")
    print(f"=" * 50)
    print(f"Calling: {to_number}")
    if name: print(f"Name: {name}")
    if address: print(f"Address: {address}")
    if incident: print(f"Incident: {incident}")
    if heartrate: print(f"Heartrate: {heartrate}")
    if breathing: print(f"Breathing: {breathing}")
    if emotion: print(f"Emotion: {emotion}")
    if webhook_url: print(f"Webhook URL: {webhook_url}")
    print(f"=" * 50)

    try:
        print("\n📞 Initiating call...")
        response = requests.post(api_url, json=data, timeout=30)
        print("Raw response:", response.text)
        result = response.json()
        if response.status_code == 200 and result.get('success'):
            print("\n✅ Call initiated successfully!")
            print(f"\nCall SID: {result.get('call_sid')}")
            print(f"Status: {result.get('status')}")
            print(f"\nAI-Generated Greeting:")
            print(f"'{result.get('greeting')}'")
            print(f"\n💡 The phone should ring shortly!")
        else:
            print("\n❌ Error initiating call:")
            print(json.dumps(result, indent=2))
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to API.")
        print("Run: python app.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")

def make_test_call_emergency(name=None, address=None, incident=None, heartrate=None, breathing=None, emotion=None, webhook_url=None):
    """
    Make a test emergency call to 16473271908.
    """
    make_test_call(
        to_number="+16473271908",
        name=name,
        address=address,
        incident=incident,
        heartrate=heartrate,
        breathing=breathing,
        emotion=emotion,
        webhook_url=webhook_url
    )

def make_test_call_family(name=None, address=None, incident=None, heartrate=None, breathing=None, emotion=None, webhook_url=None):
    """
    Make a test family call to 14168772102.
    """
    make_test_call(
        to_number="+14168772102",
        name=name,
        address=address,
        incident=incident,
        heartrate=heartrate,
        breathing=breathing,
        emotion=emotion,
        webhook_url=webhook_url
    )

def main():
    print("\n📞 Testing Emergency Call")
    print("=" * 50)
    make_test_call_emergency(
        name="John Doe",
        address="123 Main St",
        incident="Fall detected",
        heartrate="95 bpm",
        breathing="Normal",
        emotion="Distressed"
    )
    
    print("\n\n📞 Testing Family Call")
    print("=" * 50)
    make_test_call_family(
        name="Jane Smith",
        address="456 Oak Ave",
        incident="Medical alert",
        heartrate="110 bpm",
        breathing="Rapid",
        emotion="Anxious"
    )

if __name__ == "__main__":
    main()