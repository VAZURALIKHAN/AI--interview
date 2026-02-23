from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.models import User, Course, UserCourse, Lesson
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.services.ai_service import ai_service

router = APIRouter(prefix="/courses", tags=["Courses"])


class EnrollRequest(BaseModel):
    course_id: int


class ProgressUpdate(BaseModel):
    lesson_id: int
    completed: bool


# Seed data for courses
SEED_COURSES = [
    {
        "title": "Data Structures & Algorithms",
        "description": "Master fundamental data structures and algorithms for coding interviews",
        "category": "Programming",
        "difficulty": "Intermediate",
        "total_lessons": 3,
        "duration_hours": 20,
        "xp_reward": 200,
        "lessons": [
            {
                "title": "Arrays & Strings",
                "content": """
# Arrays and Strings

Arrays are the most fundamental data structure. They store elements in contiguous memory locations.

## Key Concepts
- **Access**: O(1)
- **Search**: O(n)
- **Insertion/Deletion**: O(n)

## Common Techniques
1. **Two Pointers**: Used for searching pairs, reversing, etc.
2. **Sliding Window**: Used for subarray problems.
                """,
                "duration_minutes": 45,
                "order": 1,
                "video_url": "https://www.youtube.com/watch?v=juNzBpC2lXi"
            },
            {
                "title": "Linked Lists",
                "content": "Linked lists consist of nodes where each node contains data and a reference to the next node.",
                "duration_minutes": 60,
                "order": 2,
                "video_url": "https://www.youtube.com/watch?v=njTh_OwMljA"
            },
            {
                "title": "Hash Maps",
                "content": "Hash maps provide O(1) average time complexity for lookups.",
                "duration_minutes": 50,
                "order": 3,
                "video_url": "https://www.youtube.com/watch?v=c3RVW3KGIIE"
            }
        ]
    },
    {
        "title": "System Design Fundamentals",
        "description": "Learn to design scalable distributed systems",
        "category": "System Design",
        "difficulty": "Advanced",
        "total_lessons": 2,
        "duration_hours": 15,
        "xp_reward": 250,
        "lessons": [
            {
                "title": "Scalability Basics",
                "content": "Vertical vs Horizontal Scaling.",
                "duration_minutes": 40,
                "order": 1,
                "video_url": "https://www.youtube.com/watch?v=xpDnVSmNFX0"
            },
            {
                "title": "Load Balancing",
                "content": "Distributing traffic across multiple servers.",
                "duration_minutes": 55,
                "order": 2,
                "video_url": "https://www.youtube.com/watch?v=K0GskUdrWqQ"
            }
        ]
    }, 
    {
        "title": "Behavioral Interview Mastery",
        "description": "Ace behavioral interviews with STAR method",
        "category": "Soft Skills",
        "difficulty": "Beginner",
        "total_lessons": 3,
        "duration_hours": 10,
        "xp_reward": 150,
        "lessons": [
            {
                "title": "The STAR Method",
                "content": "Situation, Task, Action, Result.",
                "duration_minutes": 30,
                "order": 1,
                "video_url": "https://www.youtube.com/watch?v=WrlF66fM8F8"
            },
            {
                "title": "Handling 'What is your weakness?'",
                "content": "Turning negatives into positives.",
                "duration_minutes": 25,
                "order": 2,
                "video_url": "https://www.youtube.com/watch?v=26O-zFv11X4"
            },
            {
                "title": "Questions to Ask the Interviewer",
                "content": "Show genuine interest and insight.",
                "duration_minutes": 20,
                "order": 3,
                "video_url": "https://www.youtube.com/watch?v=lJ_9M5g0668"
            }
        ]
    },
    {
        "title": "Python for Interviews",
        "description": "Master Python for technical interviews",
        "category": "Programming",
        "difficulty": "Beginner",
        "total_lessons": 3,
        "duration_hours": 25,
        "xp_reward": 180,
        "lessons": [
             {
                "title": "Python Lists & Slicing",
                "content": "Powerful list manipulation techniques.",
                "duration_minutes": 45,
                "order": 1,
                "video_url": "https://www.youtube.com/watch?v=ohCDNzJeQqM"
            },
            {
                "title": "Dictionaries & Sets",
                "content": "Fast lookups and unique elements.",
                "duration_minutes": 50,
                "order": 2,
                "video_url": "https://www.youtube.com/watch?v=daefaLgNkw0"
            },
            {
                "title": "Object Oriented Python",
                "content": "Classes, methods, and inheritance.",
                "duration_minutes": 60,
                "order": 3,
                "video_url": "https://www.youtube.com/watch?v=JeznW_7DlB0"
            }
        ]
    }
]


@router.get("/")
async def get_all_courses(db: Session = Depends(get_db)):
    """Get all available courses"""
    
    # Check if courses need seeding or re-seeding (if no lessons)
    existing_courses_count = db.query(Course).count()
    existing_lessons_count = db.query(Lesson).count()
    
    if existing_courses_count == 0 or (existing_courses_count > 0 and existing_lessons_count == 0):
        # Clear existing if no lessons to be safe (re-seed)
        if existing_courses_count > 0:
             db.query(UserCourse).delete() # Delete enrollments
             db.query(Course).delete()
             db.commit()
             
        for course_dict in SEED_COURSES:
            course_data = course_dict.copy()
            
            # Extract lessons data
            lessons_data = course_data.pop("lessons", [])
            
            # Create course
            course = Course(**course_data)
            db.add(course)
            db.flush() # Flush to get the course ID
            
            # Create lessons for the course
            for lesson_dict in lessons_data:
                lesson_data = lesson_dict.copy()
                video_url = lesson_data.pop("video_url", "")
                lesson = Lesson(
                    title=lesson_data.get("title"),
                    content=lesson_data.get("content"),
                    duration_minutes=lesson_data.get("duration_minutes"),
                    order=lesson_data.get("order"),
                    course_id=course.id,
                    video_url=video_url
                )
                db.add(lesson)
                
        db.commit()
    
    courses = db.query(Course).all()
    
    return {
        "courses": [
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "category": course.category,
                "difficulty": course.difficulty,
                "total_lessons": course.total_lessons,
                "duration_hours": course.duration_hours,
                "xp_reward": course.xp_reward
            }
            for course in courses
        ]
    }


@router.get("/my-courses")
async def get_my_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get courses user is enrolled in"""
    
    user_courses = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id
    ).all()
    
    result = []
    for uc in user_courses:
        course = db.query(Course).filter(Course.id == uc.course_id).first()
        if course:
            result.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "progress_percentage": uc.progress_percentage,
                "completed": uc.completed,
                "started_at": uc.started_at.isoformat()
            })
    
    return {"courses": result}


@router.get("/{course_id}")
async def get_course_details(
    course_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed course information"""
    
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()
    
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "category": course.category,
        "difficulty": course.difficulty,
        "total_lessons": course.total_lessons,
        "duration_hours": course.duration_hours,
        "xp_reward": course.xp_reward,
        "lessons": [
            {
                "id": lesson.id,
                "title": lesson.title,
                "order": lesson.order,
                "duration_minutes": lesson.duration_minutes
            }
            for lesson in lessons
        ]
    }


@router.post("/{course_id}/enroll")
async def enroll_in_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enroll user in a course"""
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if already enrolled
    existing = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    # Create enrollment
    user_course = UserCourse(
        user_id=current_user.id,
        course_id=course_id,
        progress_percentage=0.0,
        completed_lessons=[],
        completed=False
    )
    
    db.add(user_course)
    db.commit()
    
    return {
        "message": "Successfully enrolled",
        "course_id": course_id,
        "course_title": course.title
    }


@router.post("/{course_id}/unenroll")
async def unenroll_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unenroll user from a course"""
    
    enrollment = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    db.delete(enrollment)
    db.commit()
    
    return {"message": "Successfully unenrolled from course"}








@router.post("/{course_id}/progress")
async def update_progress(
    course_id: int,
    update: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update course progress"""
    
    user_course = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()
    
    if not user_course:
        raise HTTPException(status_code=404, detail="Not enrolled in this course")
    
    course = db.query(Course).filter(Course.id == course_id).first()
    
    # Update completed lessons
    # IMPORTANT: Create a COPY of the list, modify it, then re-assign it
    # SQLAlchemy tracking for JSON/Array fields can be tricky if modifying in-place
    completed_lessons = list(user_course.completed_lessons) if user_course.completed_lessons else []
    
    if update.completed:
        if update.lesson_id not in completed_lessons:
            completed_lessons.append(update.lesson_id)
    else:
        if update.lesson_id in completed_lessons:
            completed_lessons.remove(update.lesson_id)
    
    # Re-assign to trigger update and use flag_modified for JSON tracking
    user_course.completed_lessons = completed_lessons
    flag_modified(user_course, "completed_lessons")
    
    # Calculate progress
    progress = (len(completed_lessons) / course.total_lessons) * 100
    user_course.progress_percentage = progress
    
    xp_earned = 0
    # Check if course is completed
    if len(completed_lessons) >= course.total_lessons and not user_course.completed:
        user_course.completed = True
        user_course.completed_at = datetime.utcnow()
        
        # Award XP
        xp_earned = course.xp_reward
        current_user.total_xp += xp_earned
        current_user.level = (current_user.total_xp // 1000) + 1
    
    db.commit()
    
    return {
        "progress_percentage": progress,
        "completed": user_course.completed,
        "xp_earned": xp_earned,
        "total_xp": current_user.total_xp
    }


@router.get("/{course_id}/progress")
async def get_course_progress(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get progress for a specific course"""
    
    user_course = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()
    
    if not user_course:
        raise HTTPException(status_code=404, detail="Not enrolled in this course")
    
    return {
        "progress_percentage": user_course.progress_percentage,
        "completed_lessons": user_course.completed_lessons or [],
        "completed": user_course.completed,
        "started_at": user_course.started_at.isoformat(),
        "completed_at": user_course.completed_at.isoformat() if user_course.completed_at else None
    }


@router.get("/{course_id}/lessons/{lesson_id}")
async def get_lesson_details(
    course_id: int,
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get content for a specific lesson (only if enrolled)"""
    
    # Check enrollment
    user_course = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()
    
    if not user_course:
        raise HTTPException(status_code=403, detail="You must be enrolled to view lesson content")
    
    lesson = db.query(Lesson).filter(
        Lesson.id == lesson_id,
        Lesson.course_id == course_id
    ).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
        
    return {
        "id": lesson.id,
        "title": lesson.title,
        "content": lesson.content,
        "video_url": lesson.video_url,
        "duration_minutes": lesson.duration_minutes,
        "order": lesson.order
    }


@router.get("/{course_id}/lessons/{lesson_id}/explain")
async def get_ai_explanation(
    course_id: int,
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI explanation for a lesson"""
    
    lesson = db.query(Lesson).filter(
        Lesson.id == lesson_id,
        Lesson.course_id == course_id
    ).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
        
    course = db.query(Course).filter(Course.id == course_id).first()
    
    explanation = ai_service.explain_lesson_concept(
        course_title=course.title,
        lesson_title=lesson.title,
        lesson_content=lesson.content
    )
    
    return {"explanation": explanation}


@router.get("/{course_id}/certificate")
async def get_course_certificate(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get completion certificate for a course"""
    
    user_course = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()
    
    if not user_course or not user_course.completed:
        raise HTTPException(
            status_code=400, 
            detail="Course not completed. Finish all lessons to earn your certificate."
        )
        
    course = db.query(Course).filter(Course.id == course_id).first()
    
    # In a real app, this might generate a PDF
    # Here we return metadata for the frontend to render the certificate
    return {
        "certificate_id": f"CERT-{current_user.id}-{course_id}-{int(datetime.utcnow().timestamp())}",
        "user_name": current_user.name,
        "course_title": course.title,
        "completed_at": user_course.completed_at.strftime("%B %d, %Y"),
        "instructor": "AI Interview Prep Team",
        "duration_hours": course.duration_hours
    }
