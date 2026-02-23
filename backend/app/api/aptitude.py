from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.models import User, AptitudeTest
from app.services.ai_service import ai_service
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

router = APIRouter(prefix="/aptitude", tags=["Aptitude Tests"])


class QuestionRequest(BaseModel):
    category: str  # Logical, Quantitative, Verbal
    difficulty: str  # Easy, Medium, Hard
    count: Optional[int] = 10


class TestSubmission(BaseModel):
    category: str
    difficulty: str
    questions_data: dict
    correct_answers: int
    total_questions: int
    time_taken: int  # seconds


@router.post("/questions")
async def get_questions(
    request: QuestionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate aptitude test questions"""
    questions = ai_service.generate_aptitude_questions(
        category=request.category,
        difficulty=request.difficulty,
        count=request.count
    )
    
    return {
        "questions": questions,
        "category": request.category,
        "difficulty": request.difficulty,
        "total_questions": len(questions)
    }


@router.post("/submit")
async def submit_test(
    submission: TestSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit aptitude test results"""
    
    # Calculate score
    score = (submission.correct_answers / submission.total_questions) * 100
    
    # Calculate XP based on performance
    xp_earned = int(score) + (10 if score >= 80 else 5)
    
    # Create test record
    test = AptitudeTest(
        user_id=current_user.id,
        category=submission.category,
        score=score,
        total_questions=submission.total_questions,
        correct_answers=submission.correct_answers,
        time_taken=submission.time_taken,
        questions_data=submission.questions_data
    )
    
    db.add(test)
    
    # Update user XP
    current_user.total_xp += xp_earned
    current_user.level = (current_user.total_xp // 1000) + 1
    
    db.commit()
    db.refresh(test)
    
    return {
        "test_id": test.id,
        "score": score,
        "xp_earned": xp_earned,
        "total_xp": current_user.total_xp,
        "level": current_user.level,
        "message": "Great job!" if score >= 80 else "Keep practicing!"
    }


@router.get("/history")
async def get_test_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's test history"""
    tests = db.query(AptitudeTest).filter(
        AptitudeTest.user_id == current_user.id
    ).order_by(AptitudeTest.created_at.desc()).all()
    
    return {
        "tests": [
            {
                "id": test.id,
                "category": test.category,
                "score": test.score,
                "correct_answers": test.correct_answers,
                "total_questions": test.total_questions,
                "time_taken": test.time_taken,
                "created_at": test.created_at.isoformat()
            }
            for test in tests
        ],
        "total_tests": len(tests),
        "average_score": sum(t.score for t in tests) / len(tests) if tests else 0
    }


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get aptitude test statistics"""
    tests = db.query(AptitudeTest).filter(
        AptitudeTest.user_id == current_user.id
    ).all()
    
    if not tests:
        return {
            "total_tests": 0,
            "average_score": 0,
            "best_score": 0,
            "by_category": {}
        }
    
    # Group by category
    by_category = {}
    for test in tests:
        if test.category not in by_category:
            by_category[test.category] = []
        by_category[test.category].append(test.score)
    
    return {
        "total_tests": len(tests),
        "average_score": round(sum(t.score for t in tests) / len(tests), 2),
        "best_score": max(t.score for t in tests),
        "by_category": {
            cat: {
                "count": len(scores),
                "average": round(sum(scores) / len(scores), 2),
                "best": max(scores)
            }
            for cat, scores in by_category.items()
        }
    }

@router.get("/{test_id}/certificate")
async def get_test_certificate(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get completion certificate for an aptitude test"""
    
    test = db.query(AptitudeTest).filter(
        AptitudeTest.id == test_id,
        AptitudeTest.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
        
    if test.score < 80:
        raise HTTPException(
            status_code=400, 
            detail="Score too low. You need at least 80% to earn a certificate."
        )
        
    return {
        "certificate_id": f"APT-{current_user.id}-{test_id}-{int(datetime.utcnow().timestamp())}",
        "user_name": current_user.name,
        "category": test.category,
        "score": test.score,
        "completed_at": test.created_at.strftime("%B %d, %Y"),
        "instructor": "AI Interview Prep System"
    }
