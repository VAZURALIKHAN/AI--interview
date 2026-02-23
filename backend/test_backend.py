"""
Backend API Test Script
This script tests all backend endpoints to ensure they're working correctly
"""
import requests
import json
from datetime import datetime
import sys
import io

# Set UTF-8 encoding for Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:8000"

def print_result(test_name, success, message=""):
    status = "[PASS]" if success else "[FAIL]"
    print(f"{status} - {test_name}")
    if message:
        print(f"   {message}")
    print()

def test_health_check():
    """Test if the server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print_result("Health Check", response.status_code == 200, f"Status: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print_result("Health Check", False, f"Error: {str(e)}")
        return False

def test_root_endpoint():
    """Test root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print_result("Root Endpoint", response.status_code == 200, f"Message: {response.json().get('message')}")
        return response.status_code == 200
    except Exception as e:
        print_result("Root Endpoint", False, f"Error: {str(e)}")
        return False

def test_current_user():
    """Test getting current user (demo mode)"""
    try:
        response = requests.get(f"{BASE_URL}/auth/me", timeout=5)
        success = response.status_code == 200
        if success:
            user_data = response.json()
            print_result("Get Current User", True, f"User: {user_data.get('name')} ({user_data.get('email')})")
        else:
            print_result("Get Current User", False, f"Status Code: {response.status_code}")
        return success
    except Exception as e:
        print_result("Get Current User", False, f"Error: {str(e)}")
        return False

def test_courses():
    """Test courses endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/courses", timeout=5)
        success = response.status_code == 200
        if success:
            courses = response.json()
            print_result("Get All Courses", True, f"Found {len(courses)} courses")
        else:
            print_result("Get All Courses", False, f"Status Code: {response.status_code}")
        return success
    except Exception as e:
        print_result("Get All Courses", False, f"Error: {str(e)}")
        return False

def test_dashboard_stats():
    """Test dashboard stats"""
    try:
        response = requests.get(f"{BASE_URL}/dashboard/stats", timeout=5)
        success = response.status_code == 200
        if success:
            stats = response.json()
            print_result("Dashboard Stats", True, f"Stats loaded successfully")
        else:
            print_result("Dashboard Stats", False, f"Status Code: {response.status_code}")
        return success
    except Exception as e:
        print_result("Dashboard Stats", False, f"Error: {str(e)}")
        return False

def test_gamification_stats():
    """Test gamification stats"""
    try:
        response = requests.get(f"{BASE_URL}/gamification/stats", timeout=5)
        success = response.status_code == 200
        if success:
            stats = response.json()
            print_result("Gamification Stats", True, f"Level: {stats.get('level')}, XP: {stats.get('xp')}")
        else:
            print_result("Gamification Stats", False, f"Status Code: {response.status_code}")
        return success
    except Exception as e:
        print_result("Gamification Stats", False, f"Error: {str(e)}")
        return False

def test_faq():
    """Test FAQ endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/faq", timeout=5)
        success = response.status_code == 200
        if success:
            faqs = response.json()
            print_result("Get FAQs", True, f"Found {len(faqs)} FAQs")
        else:
            print_result("Get FAQs", False, f"Status Code: {response.status_code}")
        return success
    except Exception as e:
        print_result("Get FAQs", False, f"Error: {str(e)}")
        return False

def test_aptitude_questions():
    """Test aptitude questions generation"""
    try:
        payload = {
            "category": "logical",
            "difficulty": "medium",
            "count": 5
        }
        response = requests.post(f"{BASE_URL}/aptitude/questions", json=payload, timeout=10)
        success = response.status_code == 200
        if success:
            questions = response.json()
            print_result("Generate Aptitude Questions", True, f"Generated {len(questions.get('questions', []))} questions")
        else:
            print_result("Generate Aptitude Questions", False, f"Status Code: {response.status_code}")
        return success
    except Exception as e:
        print_result("Generate Aptitude Questions", False, f"Error: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("AI Interview Prep - Backend API Tests")
    print("=" * 60)
    print(f"Testing backend at: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print()

    results = []
    
    # Run all tests
    results.append(("Health Check", test_health_check()))
    results.append(("Root Endpoint", test_root_endpoint()))
    results.append(("Current User", test_current_user()))
    results.append(("Courses", test_courses()))
    results.append(("Dashboard Stats", test_dashboard_stats()))
    results.append(("Gamification Stats", test_gamification_stats()))
    results.append(("FAQs", test_faq()))
    results.append(("Aptitude Questions", test_aptitude_questions()))
    
    # Summary
    print("=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"Passed: {passed}/{total}")
    print(f"Failed: {total - passed}/{total}")
    print()
    
    if passed == total:
        print("SUCCESS: All tests passed! Backend is working perfectly!")
    else:
        print("WARNING: Some tests failed. Please check the errors above.")
        print("\nFailed tests:")
        for name, result in results:
            if not result:
                print(f"  - {name}")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
