from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import FAQ
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/faq", tags=["FAQ"])


class FAQItem(BaseModel):
    category: str
    question: str
    answer: str


# Seed FAQ data
SEED_FAQS = [
    {
        "category": "General",
        "question": "What is AI Interview Prep?",
        "answer": "AI Interview Prep is a comprehensive platform that helps you prepare for technical interviews using AI-powered mock interviews, aptitude tests, resume analysis, and structured courses.",
        "order": 1
    },
    {
        "category": "General",
        "question": "How does the XP system work?",
        "answer": "You earn XP points by completing tests, interviews, courses, and maintaining daily streaks. Every 1000 XP unlocks a new level, giving you access to more features and achievements.",
        "order": 2
    },
    {
        "category": "Tests",
        "question": "What types of aptitude tests are available?",
        "answer": "We offer Logical Reasoning, Quantitative Aptitude, and Verbal Ability tests with varying difficulty levels (Easy, Medium, Hard).",
        "order": 3
    },
    {
        "category": "Tests",
        "question": "How are tests scored?",
        "answer": "Tests are scored based on correct answers out of total questions. You receive immediate feedback and earn XP based on your performance.",
        "order": 4
    },
    {
        "category": "Interviews",
        "question": "How do AI mock interviews work?",
        "answer": "Select your desired role and difficulty level. Our AI generates relevant interview questions. Answer them, and receive detailed AI-powered feedback on your responses.",
        "order": 5
    },
    {
        "category": "Interviews",
        "question": "Can I practice for specific roles?",
        "answer": "Yes! We support multiple roles including Software Developer, Data Scientist, Product Manager, and more. Questions are tailored to each role.",
        "order": 6
    },
    {
        "category": "Resume",
        "question": "What resume formats are supported?",
        "answer": "We support PDF and DOCX formats. Upload your resume to get AI-powered analysis, ATS score, and improvement suggestions.",
        "order": 7
    },
    {
        "category": "Resume",
        "question": "What is ATS score?",
        "answer": "ATS (Applicant Tracking System) score indicates how well your resume will perform in automated screening systems used by companies. Higher scores mean better chances of getting through initial screening.",
        "order": 8
    },
    {
        "category": "Courses",
        "question": "How do I enroll in courses?",
        "answer": "Browse available courses and click 'Enroll'. Track your progress as you complete lessons. You'll earn XP and certificates upon completion.",
        "order": 9
    },
    {
        "category": "Account",
        "question": "How do I maintain my streak?",
        "answer": "Login daily and complete at least one activity (test, interview, or course lesson). Your streak increases with consecutive daily logins.",
        "order": 10
    }
]


@router.get("/")
async def get_all_faqs(db: Session = Depends(get_db)):
    """Get all FAQ items"""
    
    # Check if FAQs exist, if not create seed data
    existing_faqs = db.query(FAQ).count()
    if existing_faqs == 0:
        for faq_data in SEED_FAQS:
            faq = FAQ(**faq_data)
            db.add(faq)
        db.commit()
    
    faqs = db.query(FAQ).order_by(FAQ.order, FAQ.category).all()
    
    # Group by category
    by_category = {}
    for faq in faqs:
        if faq.category not in by_category:
            by_category[faq.category] = []
        by_category[faq.category].append({
            "id": faq.id,
            "question": faq.question,
            "answer": faq.answer
        })
    
    return {"faqs": by_category}


@router.get("/search")
async def search_faqs(
    q: str,
    db: Session = Depends(get_db)
):
    """Search FAQs by query"""
    
    faqs = db.query(FAQ).filter(
        (FAQ.question.contains(q)) | (FAQ.answer.contains(q))
    ).all()
    
    return {
        "results": [
            {
                "id": faq.id,
                "category": faq.category,
                "question": faq.question,
                "answer": faq.answer
            }
            for faq in faqs
        ]
    }
