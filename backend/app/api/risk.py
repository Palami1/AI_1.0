from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.risk.models import RiskCalculationRequest, RiskCalculationResponse
from app.risk.engine import RiskEngine

router = APIRouter()

@router.post("/calculate", response_model=RiskCalculationResponse, summary="Calculate safe position size and evaluate risk")
def calculate_risk(request: RiskCalculationRequest, db: Session = Depends(get_db)):
    """
    Processes the trade request through the Risk Engine to enforce capital protection rules.
    """
    # Assuming user_id is extracted from a JWT token in a real authenticated route.
    # For now, passing a dummy or None to trigger logic without breaking if DB isn't seeded.
    # We will pass None so it skips DB logging if the DB is not fully running, avoiding crashes.
    response = RiskEngine.evaluate_trade(request, user_id=None)
    
    return response

@router.get("/score", summary="Get current market risk score")
def risk_score(db: Session = Depends(get_db)):
    return {"score": 75, "level": "HIGH"}
