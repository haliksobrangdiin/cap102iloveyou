# test_connection.py
import requests
import json
import base64
import os
from pathlib import Path

# ===== CONFIGURATION =====
# CHANGE THIS TO YOUR IP
COMPUTER_IP = "192.168.1.100"
BASE_URL = f"http://{COMPUTER_IP}:5000"

def test_root():
    """Test the root endpoint"""
    print("\n" + "="*50)
    print("🌐 Testing Root Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=3)
        print(f"✅ Status: {response.status_code}")
        print(f"📊 Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return False

def test_health():
    """Test the health endpoint"""
    print("\n" + "="*50)
    print("💚 Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=3)
        print(f"✅ Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Response:")
            for key, value in data.items():
                print(f"   {key}: {value}")
            return True
        else:
            print(f"❌ Health check failed with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to {BASE_URL}")
        print("   Make sure:")
        print(f"   1. Flask server is running (python app.py)")
        print(f"   2. Server is running on IP {COMPUTER_IP}")
        print("   3. Both devices are on the same network")
        print("   4. Firewall is not blocking port 5000")
        return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_predict(image_path):
    """Test the predict endpoint with an image"""
    print("\n" + "="*50)
    print(f"📸 Testing Predict Endpoint with: {image_path}")
    
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        print("   Please provide a valid image path")
        return False
    
    try:
        # Read and encode image
        with open(image_path, "rb") as f:
            image_data = f.read()
        
        base64_image = base64.b64encode(image_data).decode('utf-8')
        print(f"✅ Image loaded: {len(image_data)} bytes")
        print(f"📊 Base64 length: {len(base64_image)} characters")
        
        # Prepare request
        payload = {"image": base64_image}
        
        # Send request
        print("📤 Sending request to AI server...")
        response = requests.post(
            f"{BASE_URL}/predict",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"📥 Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n📊 Prediction Result:")
            if result.get('success'):
                print(f"   ✅ Disease: {result.get('diseaseName')}")
                print(f"   📊 Confidence: {result.get('confidence')}%")
                print(f"   📝 Description: {result.get('description')}")
                print(f"   💊 Treatment: {result.get('treatment')}")
                print(f"   🛡️ Prevention: {result.get('prevention')}")
                print(f"   ⚠️ Severity: {result.get('severity')}")
                
                if result.get('allProbabilities'):
                    print("\n   📊 All Probabilities:")
                    for disease, prob in result['allProbabilities'].items():
                        print(f"      {disease}: {prob}%")
            else:
                print(f"   ❌ Error: {result.get('message')}")
                if result.get('detection_metrics'):
                    print(f"   📊 Detection Metrics:")
                    for key, value in result['detection_metrics'].items():
                        print(f"      {key}: {value}")
            return True
        else:
            print(f"❌ Request failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to {BASE_URL}")
        return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Server took too long to respond.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main test function"""
    print("\n🚀 TESTING ROOTCARE AI API")
    print("="*50)
    print(f"📍 Server URL: {BASE_URL}")
    print(f"📱 Make sure Flask server is running!")
    print("="*50)
    
    # Test root
    root_ok = test_root()
    
    # Test health
    health_ok = test_health()
    
    if not health_ok:
        print("\n⚠️ Health check failed. Please fix the connection issues first.")
        return
    
    # Test with sample image (if provided)
    image_path = input("\n📸 Enter path to test image (or press Enter to skip): ").strip()
    if image_path:
        test_predict(image_path)
    else:
        print("\nℹ️ Skipping image test. You can test manually with:")
        print(f"   curl -X POST {BASE_URL}/predict -H 'Content-Type: application/json' -d '{{\"image\": \"BASE64_IMAGE\"}}'")
    
    print("\n" + "="*50)
    print("✅ Testing complete!")
    print(f"📝 Check server.log for detailed logs")

if __name__ == "__main__":
    main()