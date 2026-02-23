from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    avatar = Column(String, default="/default-avatar.png")
    bio = Column(Text, default="")
    total_xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_count = Column(Integer, default=0)
    last_login = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    aptitude_tests = relationship("AptitudeTest", back_populates="user")
    mock_interviews = relationship("MockInterview", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    user_courses = relationship("UserCourse", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")


class AptitudeTest(Base):
    __tablename__ = "aptitude_tests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String)  # Logical, Quantitative, Verbal, etc.
    score = Column(Float)
    total_questions = Column(Integer)
    correct_answers = Column(Integer)
    time_taken = Column(Integer)  # in seconds
    questions_data = Column(JSON)  # Store questions and answers
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="aptitude_tests")


class MockInterview(Base):
    __tablename__ = "mock_interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)  # SDE, Data Scientist, etc.
    difficulty = Column(String)  # Easy, Medium, Hard
    questions = Column(JSON)
    responses = Column(JSON)
    ai_feedback = Column(JSON)
    overall_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="mock_interviews")


class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    analysis_result = Column(JSON)
    ats_score = Column(Float)
    suggestions = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resumes")


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    thumbnail = Column(String)
    category = Column(String)
    difficulty = Column(String)  # Beginner, Intermediate, Advanced
    total_lessons = Column(Integer)
    duration_hours = Column(Integer)
    xp_reward = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user_courses = relationship("UserCourse", back_populates="course")
    lessons = relationship("Lesson", back_populates="course")


class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    content = Column(Text)
    video_url = Column(String)
    order = Column(Integer)
    duration_minutes = Column(Integer)
    
    course = relationship("Course", back_populates="lessons")


class UserCourse(Base):
    __tablename__ = "user_courses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    progress_percentage = Column(Float, default=0.0)
    completed_lessons = Column(JSON, default=[])
    completed = Column(Boolean, default=False)
    certificate_url = Column(String, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="user_courses")
    course = relationship("Course", back_populates="user_courses")


class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_type = Column(String)  # first_test, streak_7, level_10, etc.
    title = Column(String)
    description = Column(String)
    icon = Column(String)
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="achievements")


class FAQ(Base):
    __tablename__ = "faqs"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
