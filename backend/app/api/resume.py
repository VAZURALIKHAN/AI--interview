from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.models import User, Resume
from app.services.ai_service import ai_service
from app.services.resume_parser import parse_resume
from app.core.config import settings
from pydantic import BaseModel
import os
from datetime import datetime
import shutil

router = APIRouter(prefix="/resume", tags=["Resume Analysis"])


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and analyze resume"""
    
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported"
        )
    
    # Save file
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{current_user.id}_{timestamp}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Parse resume
    with open(file_path, "rb") as f:
        file_content = f.read()
    
    resume_text = parse_resume(file.filename, file_content)
    
    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Failed to extract text from resume"
        )
    
    # Analyze resume with AI
    analysis = ai_service.analyze_resume(resume_text)
    
    # Create resume record
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        analysis_result=analysis,
        ats_score=analysis.get("ats_score", 75),
        suggestions=analysis.get("improvements", [])
    )
    
    db.add(resume)
    
    # Award XP
    xp_earned = 15
    current_user.total_xp += xp_earned
    current_user.level = (current_user.total_xp // 1000) + 1
    
    db.commit()
    db.refresh(resume)
    
    return {
        "resume_id": resume.id,
        "filename": file.filename,
        "analysis": analysis,
        "xp_earned": xp_earned
    }


@router.get("/all")
async def get_all_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all resumes for current user"""
    
    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.created_at.desc()).all()
    
    return {
        "resumes": [
            {
                "id": resume.id,
                "filename": resume.filename,
                "ats_score": resume.ats_score,
                "created_at": resume.created_at.isoformat()
            }
            for resume in resumes
        ]
    }


@router.get("/{resume_id}")
async def get_resume_analysis(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed analysis of a specific resume"""
    
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {
        "id": resume.id,
        "filename": resume.filename,
        "ats_score": resume.ats_score,
        "analysis": resume.analysis_result,
        "suggestions": resume.suggestions,
        "created_at": resume.created_at.isoformat()
    }


@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a resume"""
    
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Delete file
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}
