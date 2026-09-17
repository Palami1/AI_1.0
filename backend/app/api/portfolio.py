from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.base import Portfolio, Stock, AILog

router = APIRouter()

@router.get("/", summary="Get user portfolio positions")
def get_portfolio(db: Session = Depends(get_db)):
    """Returns real portfolio data from PostgreSQL."""
    # TODO: In production, filter by JWT user_id
    portfolios = db.query(Portfolio).filter(Portfolio.is_deleted == False).all()
    return [
        {
            "id": str(p.id),
            "stock_id": p.stock_id,
            "quantity": p.quantity,
            "average_price": p.average_price,
        }
        for p in portfolios
    ]

@router.post("/trade", summary="Add a trade to portfolio")
def create_trade(db: Session = Depends(get_db)):
    return {"message": "Trade added"}

@router.get("/risk-summary", summary="Get portfolio risk summary")
def risk_summary(db: Session = Depends(get_db)):
    portfolios = db.query(Portfolio).filter(Portfolio.is_deleted == False).all()
    total_value = sum(p.quantity * p.average_price for p in portfolios)
    return {
        "totalValue": total_value,
        "totalPnl": 0,
        "totalPnlPercent": 0,
        "riskExposure": "LOW",
    }
