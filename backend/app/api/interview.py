from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.models import User, MockInterview
from app.services.ai_service import ai_service
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/interview", tags=["Mock Interviews"])


class StartInterviewRequest(BaseModel):
    role: str  # SDE, Data Scientist, Product Manager, etc.
    difficulty: str  # Easy, Medium, Hard
    count: Optional[int] = 5



class ResponseSubmission(BaseModel):
    question_id: int
    question: str
    response: str
    expected_points: List[str]


@router.post("/start")
async def start_interview(
    request: StartInterviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a new mock interview"""
    
    # Generate interview questions
    questions = ai_service.generate_interview_questions(
        role=request.role,
        difficulty=request.difficulty,
        count=request.count
    )

    
    # Create interview record
    interview = MockInterview(
        user_id=current_user.id,
        role=request.role,
        difficulty=request.difficulty,
        questions=questions,
        responses=[],
        ai_feedback=[],
        overall_score=0
    )
    
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    return {
        "interview_id": interview.id,
        "role": request.role,
        "difficulty": request.difficulty,
        "questions": questions,
        "total_questions": len(questions)
    }


@router.post("/{interview_id}/respond")
async def submit_response(
    interview_id: int,
    response: ResponseSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit response to an interview question"""
    
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Evaluate the response using AI
    evaluation = ai_service.evaluate_interview_response(
        question=response.question,
        response=response.response,
        expected_points=response.expected_points
    )
    
    # Update interview record
    responses = interview.responses or []
    feedback = interview.ai_feedback or []
    
    responses.append({
        "question_id": response.question_id,
        "question": response.question,
        "response": response.response,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    feedback.append({
        "question_id": response.question_id,
        **evaluation
    })
    
    interview.responses = responses
    interview.ai_feedback = feedback
    
    db.commit()
    
    return {
        "evaluation": evaluation,
        "xp_earned": evaluation.get("score", 70) // 10
    }


@router.post("/{interview_id}/complete")
async def complete_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Complete the interview and calculate overall score"""
    
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Calculate overall score
    if interview.ai_feedback:
        scores = [f.get("score", 0) for f in interview.ai_feedback]
        overall_score = sum(scores) / len(scores)
    else:
        overall_score = 0
    
    interview.overall_score = overall_score
    
    # Award XP
    xp_earned = int(overall_score) + (20 if overall_score >= 80 else 10)
    current_user.total_xp += xp_earned
    current_user.level = (current_user.total_xp // 1000) + 1
    
    db.commit()
    
    return {
        "overall_score": overall_score,
        "xp_earned": xp_earned,
        "total_xp": current_user.total_xp,
        "level": current_user.level,
        "feedback_summary": interview.ai_feedback
    }


@router.get("/history")
async def get_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's interview history"""
    
    interviews = db.query(MockInterview).filter(
        MockInterview.user_id == current_user.id
    ).order_by(MockInterview.created_at.desc()).all()
    
    return {
        "interviews": [
            {
                "id": interview.id,
                "role": interview.role,
                "difficulty": interview.difficulty,
                "overall_score": interview.overall_score,
                "total_questions": len(interview.questions or []),
                "created_at": interview.created_at.isoformat()
            }
            for interview in interviews
        ]
    }


@router.get("/{interview_id}/feedback")
async def get_interview_feedback(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed feedback for an interview"""
    
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    return {
        "interview_id": interview.id,
        "role": interview.role,
        "difficulty": interview.difficulty,
        "overall_score": interview.overall_score,
        "questions": interview.questions,
        "responses": interview.responses,
        "feedback": interview.ai_feedback
    }

@router.get("/{interview_id}/certificate")
async def get_interview_certificate(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get completion certificate for an interview"""
    
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    if interview.overall_score < 70:
        raise HTTPException(
            status_code=400, 
            detail="Score too low. You need at least 70% to earn a certificate."
        )
        
    return {
        "certificate_id": f"INT-{current_user.id}-{interview_id}-{int(datetime.utcnow().timestamp())}",
        "user_name": current_user.name,
        "role": interview.role,
        "difficulty": interview.difficulty,
        "score": interview.overall_score,
        "completed_at": interview.created_at.strftime("%B %d, %Y"),
        "instructor": "AI Interview Prep System"
    }
