from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, AptitudeTest, MockInterview, UserCourse
from app.api.auth import get_current_user
from datetime import datetime, timedelta
from sqlalchemy import func

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard statistics"""
    
    # Aptitude tests stats
    total_tests = db.query(AptitudeTest).filter(
        AptitudeTest.user_id == current_user.id
    ).count()
    
    test_scores = db.query(AptitudeTest.score).filter(
        AptitudeTest.user_id == current_user.id
    ).all()
    
    avg_test_score = sum(score[0] for score in test_scores) / len(test_scores) if test_scores else 0
    
    # Interview stats
    total_interviews = db.query(MockInterview).filter(
        MockInterview.user_id == current_user.id
    ).count()
    
    interview_scores = db.query(MockInterview.overall_score).filter(
        MockInterview.user_id == current_user.id,
        MockInterview.overall_score > 0
    ).all()
    
    avg_interview_score = sum(score[0] for score in interview_scores) / len(interview_scores) if interview_scores else 0
    
    # Course stats
    enrolled_courses = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id
    ).count()
    
    completed_courses = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.completed == True
    ).count()
    
    # Recent activity (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    recent_tests = db.query(AptitudeTest).filter(
        AptitudeTest.user_id == current_user.id,
        AptitudeTest.created_at >= seven_days_ago
    ).count()
    
    recent_interviews = db.query(MockInterview).filter(
        MockInterview.user_id == current_user.id,
        MockInterview.created_at >= seven_days_ago
    ).count()
    
    return {
        "user": {
            "name": current_user.name,
            "email": current_user.email,
            "level": current_user.level,
            "total_xp": current_user.total_xp,
            "streak_count": current_user.streak_count
        },
        "overview": {
            "total_tests": total_tests,
            "avg_test_score": round(avg_test_score, 2),
            "total_interviews": total_interviews,
            "avg_interview_score": round(avg_interview_score, 2),
            "enrolled_courses": enrolled_courses,
            "completed_courses": completed_courses
        },
        "recent_activity": {
            "tests_this_week": recent_tests,
            "interviews_this_week": recent_interviews
        }
    }


@router.get("/activity")
async def get_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """Get recent activity feed"""
    
    activities = []
    
    # Recent tests
    recent_tests = db.query(AptitudeTest).filter(
        AptitudeTest.user_id == current_user.id
    ).order_by(AptitudeTest.created_at.desc()).limit(5).all()
    
    for test in recent_tests:
        activities.append({
            "type": "test",
            "title": f"Completed {test.category} Test",
            "score": test.score,
            "timestamp": test.created_at.isoformat()
        })
    
    # Recent interviews
    recent_interviews = db.query(MockInterview).filter(
        MockInterview.user_id == current_user.id
    ).order_by(MockInterview.created_at.desc()).limit(5).all()
    
    for interview in recent_interviews:
        activities.append({
            "type": "interview",
            "title": f"{interview.role} Interview",
            "score": interview.overall_score,
            "timestamp": interview.created_at.isoformat()
        })
    
    # Sort by timestamp
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return {"activities": activities[:limit]}


@router.get("/charts/progress")
async def get_progress_chart_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get data for progress charts (last 30 days)"""
    
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    # Test scores over time
    tests = db.query(AptitudeTest).filter(
        AptitudeTest.user_id == current_user.id,
        AptitudeTest.created_at >= thirty_days_ago
    ).order_by(AptitudeTest.created_at).all()
    
    # Interview scores over time
    interviews = db.query(MockInterview).filter(
        MockInterview.user_id == current_user.id,
        MockInterview.created_at >= thirty_days_ago
    ).order_by(MockInterview.created_at).all()
    
    return {
        "test_progress": [
            {
                "date": test.created_at.strftime("%Y-%m-%d"),
                "score": test.score,
                "category": test.category
            }
            for test in tests
        ],
        "interview_progress": [
            {
                "date": interview.created_at.strftime("%Y-%m-%d"),
                "score": interview.overall_score,
                "role": interview.role
            }
            for interview in interviews
        ]
    }
