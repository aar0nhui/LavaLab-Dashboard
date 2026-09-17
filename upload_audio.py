import urllib.request
import json
import ssl

# Download a tiny mp3 (1 second silence)
mp3_url = "https://github.com/anars/blank-audio/raw/master/1-second-of-silence.mp3"
mp3_data = None
context = ssl._create_unverified_context()
with urllib.request.urlopen(mp3_url, context=context) as response:
    mp3_data = response.read()

# Upload to Supabase Storage
upload_url = "https://habdhvqhxytkwehtgjfw.supabase.co/storage/v1/object/recordings/sample.mp3"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Content-Type": "audio/mpeg"
}

req = urllib.request.Request(upload_url, data=mp3_data, headers=headers, method="POST")
try:
    with urllib.request.urlopen(req, context=context) as response:
        print("Upload success:", response.read().decode())
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Response:", e.read().decode())
