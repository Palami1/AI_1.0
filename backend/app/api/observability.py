from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.paper_trading.models import PaperAccount
from app.paper_trading.journal import TradeJournal
from app.monitoring.production_gate import ProductionGate

router = APIRouter()


@router.get("/accounts/{account_id}/journal", summary="Get detailed trade journal with lessons")
def get_trade_journal(account_id: str, limit: int = 50, db: Session = Depends(get_db)):
    account = db.query(PaperAccount).filter(PaperAccount.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return TradeJournal.get_trade_journal(db, account_id, limit)


@router.get("/agents/performance", summary="Get per-agent accuracy breakdown")
def get_agent_performance(db: Session = Depends(get_db)):
    """Shows which agents are helping and which are dragging down AI accuracy."""
    return TradeJournal.get_agent_performance_summary(db)


@router.get("/accounts/{account_id}/production-gate", summary="Full production readiness check")
def check_production_gate(account_id: str, db: Session = Depends(get_db)):
    """
    Runs all 8 production gate checks.
    eligible_for_phase_13 = true only when ALL gates pass.
    """
    account = db.query(PaperAccount).filter(PaperAccount.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return ProductionGate.evaluate(db, account)


@router.post("/alerts/test", summary="Send a test alert to configured channels")
def test_alert():
    """Sends a test Telegram message to verify the alert pipeline."""
    from app.monitoring.alerts import AlertService, AlertPayload, AlertLevel
    from app.monitoring.alerts import TelegramAlerter
    alerter = TelegramAlerter()
    result = alerter.send(AlertPayload(
        title="Alert System Test",
        body="LAO_AI_INVESTMENT_OS alert pipeline is working correctly.",
        level=AlertLevel.INFO,
    ))
    return {"sent": result}
