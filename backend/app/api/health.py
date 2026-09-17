from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database.session import get_db
from sqlalchemy import text

router = APIRouter()

@router.get("/health", summary="Docker Health Check")
def health_check(db: Session = Depends(get_db)):
    """
    Used by Docker healthcheck to verify API and Database status.
    """
    status = {"api": "UP", "database": "DOWN"}
    
    try:
        # Simple query to verify database connection
        db.execute(text("SELECT 1"))
        status["database"] = "UP"
    except Exception as e:
        status["database"] = f"DOWN: {str(e)}"
        
    return status
