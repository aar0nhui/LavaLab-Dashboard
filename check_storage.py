import urllib.request
import json
import ssl

url = "https://habdhvqhxytkwehtgjfw.supabase.co/storage/v1/object/sign/recordings/sample.mp3"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Content-Type": "application/json"
}
data = json.dumps({"expiresIn": 3600}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers=headers, method="POST")
try:
    context = ssl._create_unverified_context()
    with urllib.request.urlopen(req, context=context) as response:
        res = json.loads(response.read().decode())
        print("Signed URL:", res)
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Response:", e.read().decode())
