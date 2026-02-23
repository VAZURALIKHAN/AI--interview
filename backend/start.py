"""
Simple startup script for the backend server
Run this with: python start.py
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting AI Interview Prep Backend Server...")
    print("📍 Server will run at: http://localhost:8000")
    print("📚 API Docs available at: http://localhost:8000/docs")
    print("\n▶️  Press CTRL+C to stop the server\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
