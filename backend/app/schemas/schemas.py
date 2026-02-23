from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    avatar: str
    bio: str
    total_xp: int
    level: int
    streak_count: int
    last_login: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Aptitude Test Schemas
class AptitudeTestCreate(BaseModel):
    category: str
    questions_data: dict


class AptitudeTestResponse(BaseModel):
    id: int
    category: str
    score: float
    total_questions: int
    correct_answers: int
    time_taken: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Mock Interview Schemas
class MockInterviewCreate(BaseModel):
    role: str
    difficulty: str


class MockInterviewResponse(BaseModel):
    id: int
    role: str
    difficulty: str
    questions: List[dict]
    overall_score: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Resume Schemas
class ResumeAnalysisResponse(BaseModel):
    id: int
    filename: str
    ats_score: float
    analysis_result: dict
    suggestions: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Course Schemas
class CourseBase(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str


class CourseResponse(CourseBase):
    id: int
    thumbnail: str
    total_lessons: int
    duration_hours: int
    xp_reward: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserCourseProgress(BaseModel):
    course_id: int
    progress_percentage: float
    completed: bool
    started_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Achievement Schemas
class AchievementResponse(BaseModel):
    id: int
    achievement_type: str
    title: str
    description: str
    icon: str
    earned_at: datetime
    
    class Config:
        from_attributes = True


# FAQ Schemas
class FAQResponse(BaseModel):
    id: int
    category: str
    question: str
    answer: str
    
    class Config:
        from_attributes = True


# Dashboard Schemas
class DashboardStats(BaseModel):
    total_tests: int
    avg_test_score: float
    total_interviews: int
    avg_interview_score: float
    courses_enrolled: int
    courses_completed: int
    total_xp: int
    level: int
    streak_count: int
    recent_achievements: List[AchievementResponse]
