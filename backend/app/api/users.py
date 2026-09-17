from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db

router = APIRouter()

@router.get("/me", summary="Get current user profile")
def get_profile(db: Session = Depends(get_db)):
    # TODO: Fetch user from DB using JWT token
    return {"id": "usr_123", "email": "investor@laoai.com"}

@router.put("/me", summary="Update user profile")
def update_profile(db: Session = Depends(get_db)):
    # TODO: Update user risk tolerance, etc.
    return {"message": "Profile updated"}
