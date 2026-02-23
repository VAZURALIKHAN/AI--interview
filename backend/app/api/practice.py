from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.models import User
from app.services.ai_service import ai_service
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/practice", tags=["Practice & Learning"])

class CodingRequest(BaseModel):
    category: str
    difficulty: str
    language: Optional[str] = "Python"
    count: Optional[int] = 3

class TutorialRequest(BaseModel):
    category: str
    topic: str

@router.post("/coding/problems")
async def get_coding_problems(
    request: CodingRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate coding practice problems"""
    problems = ai_service.generate_coding_problems(
        category=request.category,
        difficulty=request.difficulty,
        language=request.language,
        count=request.count
    )
    return {"problems": problems}

@router.post("/aptitude/tutorial")
async def get_aptitude_tutorial(
    request: TutorialRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate an aptitude tutorial"""
    tutorial = ai_service.generate_aptitude_tutorial(
        category=request.category,
        topic=request.topic
    )
    return {"tutorial": tutorial}

@router.post("/coding/submit")
async def submit_coding_solution(
    submission: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a coding solution and earn XP"""
    # Simply award XP for practice
    xp_earned = 25
    current_user.total_xp += xp_earned
    current_user.level = (current_user.total_xp // 1000) + 1
    db.commit()
    
    return {
        "success": True,
        "xp_earned": xp_earned,
        "total_xp": current_user.total_xp,
        "level": current_user.level
    }
