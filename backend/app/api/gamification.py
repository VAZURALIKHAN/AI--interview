from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.models import User, Achievement
from typing import List
from datetime import datetime

router = APIRouter(prefix="/gamification", tags=["Gamification"])


@router.get("/achievements")
async def get_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's achievements"""
    
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).order_by(Achievement.earned_at.desc()).all()
    
    return {
        "achievements": [
            {
                "id": achievement.id,
                "type": achievement.achievement_type,
                "title": achievement.title,
                "description": achievement.description,
                "icon": achievement.icon,
                "earned_at": achievement.earned_at.isoformat()
            }
            for achievement in achievements
        ]
    }


@router.get("/leaderboard")
async def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get top users by XP"""
    
    top_users = db.query(User).order_by(User.total_xp.desc()).limit(limit).all()
    
    return {
        "leaderboard": [
            {
                "rank": idx + 1,
                "name": user.name,
                "level": user.level,
                "xp": user.total_xp,
                "streak": user.streak_count
            }
            for idx, user in enumerate(top_users)
        ]
    }


@router.get("/stats")
async def get_gamification_stats(
    current_user: User = Depends(get_current_user)
):
    """Get gamification stats for current user"""
    
    # Calculate XP needed for next level
    current_level_xp = current_user.level * 1000
    next_level_xp = (current_user.level + 1) * 1000
    xp_progress = current_user.total_xp - current_level_xp
    xp_needed = next_level_xp - current_level_xp
    
    return {
        "level": current_user.level,
        "total_xp": current_user.total_xp,
        "xp_for_next_level": xp_needed,
        "xp_progress": xp_progress,
        "progress_percentage": (xp_progress / xp_needed) * 100,
        "streak_count": current_user.streak_count
    }


@router.post("/update-streak")
async def update_streak(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's daily streak"""
    
    # Check if last login was today
    from datetime import date, timedelta
    
    today = date.today()
    last_login_date = current_user.last_login.date() if current_user.last_login else None
    
    if last_login_date == today:
        return {
            "message": "Streak already updated today",
            "streak_count": current_user.streak_count
        }
    
    # Check if streak continues or resets
    if last_login_date == today - timedelta(days=1):
        # Continue streak
        current_user.streak_count += 1
        xp_earned = 5
    elif last_login_date and last_login_date < today - timedelta(days=1):
        # Reset streak
        current_user.streak_count = 1
        xp_earned = 5
    else:
        # First login
        current_user.streak_count = 1
        xp_earned = 5
    
    current_user.last_login = datetime.utcnow()
    current_user.total_xp += xp_earned
    current_user.level = (current_user.total_xp // 1000) + 1
    
    db.commit()
    
    return {
        "streak_count": current_user.streak_count,
        "xp_earned": xp_earned,
        "total_xp": current_user.total_xp
    }
