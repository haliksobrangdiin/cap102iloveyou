# test_now.py
import requests
import json

IP = "192.168.1.19"
BASE_URL = f"http://{IP}:5000"

def test_connection():
    print("=" * 60)
    print(f"🔍 Testing connection to: {BASE_URL}")
    print("=" * 60)
    
    try:
        # Test health endpoint
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"📊 Response: {json.dumps(response.json(), indent=2)}")
        print("\n✅ Server is running and accessible!")
        print(f"📱 From your phone, test: {BASE_URL}/health")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server!")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure Flask server is running:")
        print("   cd backend")
        print("   python app.py")
        print(f"\n2. Check firewall - allow port 5000")
        print("3. Make sure your phone is on the same Wi-Fi network")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_connection()