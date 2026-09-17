import urllib.request
import json
import ssl
import os

files = {
    "farmer1.mp3": r"C:\Users\Xerne\Downloads\farmer1.mp3",
    "farmer2.mp3": r"C:\Users\Xerne\Downloads\farmer2.mp3",
    "farmer3.mp3": r"C:\Users\Xerne\Downloads\farmer3.mp3",
    "farmer4.mp3": r"C:\Users\Xerne\Downloads\farmer4.mp3",
}

headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Content-Type": "audio/mpeg"
}

context = ssl._create_unverified_context()

for name, path in files.items():
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
    
    with open(path, 'rb') as f:
        data = f.read()
    
    url = f"https://habdhvqhxytkwehtgjfw.supabase.co/storage/v1/object/recordings/{name}"
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, context=context) as response:
            print(f"Upload success for {name}:", response.read().decode())
    except Exception as e:
        print(f"Error uploading {name}:", e)
        if hasattr(e, 'read'):
            print("Response:", e.read().decode())
