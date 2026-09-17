from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.paper_trading.models import PaperAccount, PerformanceReport
from app.paper_trading.portfolio import VirtualPortfolio
from app.paper_trading.metrics import PerformanceMetrics
from app.paper_trading.engine import PaperTradingEngine
from pydantic import BaseModel

router = APIRouter()


class CreateAccountRequest(BaseModel):
    name: str = "Paper Account"
    initial_capital: float = 10_000_000.0  # Default: 10M LAK


@router.post("/accounts", summary="Create a new paper trading account")
def create_account(req: CreateAccountRequest, db: Session = Depends(get_db)):
    account = VirtualPortfolio.create_account(db, req.initial_capital, req.name)
    return {"account_id": str(account.id), "name": account.name, "capital": account.initial_capital}


@router.get("/accounts/{account_id}/summary", summary="Get portfolio summary")
def get_summary(account_id: str, db: Session = Depends(get_db)):
    account = db.query(PaperAccount).filter(PaperAccount.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return VirtualPortfolio.get_summary(db, account)


@router.get("/accounts/{account_id}/metrics", summary="Get full performance metrics & production gate check")
def get_metrics(account_id: str, db: Session = Depends(get_db)):
    account = db.query(PaperAccount).filter(PaperAccount.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    metrics = PerformanceMetrics.calculate(db, account)
    return metrics


@router.post("/accounts/{account_id}/run/{symbol}", summary="Run one paper trading cycle for a symbol")
def run_cycle(account_id: str, symbol: str, risk_percent: float = 1.0):
    engine = PaperTradingEngine(account_id=account_id)
    result = engine.run_cycle(symbol, risk_percent)
    return result


@router.get("/accounts/{account_id}/history", summary="Get performance report history")
def get_report_history(account_id: str, db: Session = Depends(get_db)):
    reports = db.query(PerformanceReport).filter(
        PerformanceReport.account_id == account_id
    ).order_by(PerformanceReport.report_date.desc()).limit(90).all()
    return [
        {
            "date": r.report_date.isoformat(),
            "win_rate": r.win_rate,
            "profit_factor": r.profit_factor,
            "roi_pct": r.roi,
            "max_drawdown": r.max_drawdown,
            "sharpe_ratio": r.sharpe_ratio,
            "total_trades": r.total_trades,
        }
        for r in reports
    ]
