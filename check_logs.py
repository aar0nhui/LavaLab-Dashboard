import urllib.request
import json
import ssl

url = "https://habdhvqhxytkwehtgjfw.supabase.co/rest/v1/logs?select=*"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM"
}

req = urllib.request.Request(url, headers=headers)
try:
    context = ssl._create_unverified_context()
    with urllib.request.urlopen(req, context=context) as response:
        data = json.loads(response.read().decode())
        print(f"Number of logs: {len(data)}")
        if len(data) > 0:
            print("First log audio_path:", data[0].get('audio_path'))
except Exception as e:
    print("Error:", e)
