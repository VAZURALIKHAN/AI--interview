import requests
import json

BASE_URL = "http://localhost:8000"

endpoints = [
    ("/health", "GET"),
    ("/auth/me", "GET"),
    ("/courses", "GET"),
    ("/dashboard/stats", "GET"),
    ("/gamification/stats", "GET"),
    ("/faq", "GET")
]

def test_endpoints():
    print("Testing endpoints...")
    for endpoint, method in endpoints:
        url = f"{BASE_URL}{endpoint}"
        try:
            response = requests.request(method, url)
            print(f"{method} {endpoint}: {response.status_code}")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(response.text)
        except Exception as e:
            print(f"{method} {endpoint}: Error - {e}")
        print("-" * 20)

if __name__ == "__main__":
    test_endpoints()
