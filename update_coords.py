import urllib.request
import json
import ssl

url = "https://habdhvqhxytkwehtgjfw.supabase.co/rest/v1/logs"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYmRodnFoeHl0a3dlaHRnamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODk4ODIsImV4cCI6MjEwNTE2NTg4Mn0.0P2oodWS_ZEocdcGzVf6N-REZm_0lADa3SiKmirNvvM",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}
# A nice farm in Iowa
data = json.dumps({
    "lat": 41.9774,
    "lng": -93.4475
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers=headers, method="PATCH")
try:
    context = ssl._create_unverified_context()
    with urllib.request.urlopen(req, context=context) as response:
        print("Update all success:", response.status)
except Exception as e:
    print("Error:", e)
