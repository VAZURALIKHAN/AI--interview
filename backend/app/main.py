from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, aptitude, interview, resume, courses, gamification, dashboard, faq, practice
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="AI Interview Preparation System",
    description="Comprehensive interview preparation platform with AI-powered features",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(aptitude.router)
app.include_router(interview.router)
app.include_router(resume.router)
app.include_router(courses.router)
app.include_router(gamification.router)
app.include_router(dashboard.router)
app.include_router(faq.router)
app.include_router(practice.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to AI Interview Preparation System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
