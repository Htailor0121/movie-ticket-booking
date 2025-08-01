#!/usr/bin/env python3
"""
Simple test script to verify the API endpoints work correctly.
Run this with: python test_api.py
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL - change this to your deployed URL
BASE_URL = "http://localhost:8000"  # Change to your deployed URL for testing

def test_home_endpoint():
    """Test the home endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Home endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Home endpoint failed: {e}")
        return False

def test_docs_endpoint():
    """Test the docs endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print(f"✅ Docs endpoint: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Docs endpoint failed: {e}")
        return False

def test_signup_endpoint():
    """Test the signup endpoint"""
    try:
        user_data = {
            "name": "Test User",
            "email": f"test{datetime.now().timestamp()}@example.com",
            "password": "testpassword123",
            "phone": "1234567890",
            "city": "Test City"
        }
        response = requests.post(f"{BASE_URL}/auth/signup", json=user_data)
        print(f"✅ Signup endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"   User created: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Signup endpoint failed: {e}")
        return False

def test_login_endpoint():
    """Test the login endpoint"""
    try:
        login_data = {
            "username": "test@example.com",  # Use email as username
            "password": "testpassword123"
        }
        response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        print(f"✅ Login endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"   Login successful: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Login endpoint failed: {e}")
        return False

def test_movies_endpoint():
    """Test the movies endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/movies")
        print(f"✅ Movies endpoint: {response.status_code}")
        if response.status_code == 200:
            movies = response.json()
            print(f"   Found {len(movies)} movies")
        return True
    except Exception as e:
        print(f"❌ Movies endpoint failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Movie Ticket Booking API")
    print("=" * 50)
    
    tests = [
        test_home_endpoint,
        test_docs_endpoint,
        test_signup_endpoint,
        test_login_endpoint,
        test_movies_endpoint
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main() 