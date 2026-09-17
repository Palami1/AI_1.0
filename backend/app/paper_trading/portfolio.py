from datetime import datetime
from sqlalchemy.orm import Session
from app.paper_trading.models import PaperAccount, PaperPosition


class VirtualPortfolio:
    """
    Manages cash balance and open positions for a Paper Account.
    """

    @staticmethod
    def create_account(db: Session, initial_capital: float, name: str = "Default") -> PaperAccount:
        account = PaperAccount(
            name=name,
            initial_capital=initial_capital,
            cash_balance=initial_capital,
        )
        db.add(account)
        db.commit()
        db.refresh(account)
        return account

    @staticmethod
    def get_total_value(db: Session, account: PaperAccount) -> float:
        """Cash balance + value of all open positions at current price."""
        position_value = sum(
            (p.current_price or p.average_entry_price) * p.quantity
            for p in db.query(PaperPosition).filter(
                PaperPosition.account_id == account.id
            ).all()
        )
        return account.cash_balance + position_value

    @staticmethod
    def get_roi(db: Session, account: PaperAccount) -> float:
        """Return on Initial Capital as percentage."""
        total = VirtualPortfolio.get_total_value(db, account)
        return ((total - account.initial_capital) / account.initial_capital) * 100.0

    @staticmethod
    def get_summary(db: Session, account: PaperAccount) -> dict:
        total_value = VirtualPortfolio.get_total_value(db, account)
        positions = db.query(PaperPosition).filter(
            PaperPosition.account_id == account.id
        ).all()

        return {
            "account_id": str(account.id),
            "name": account.name,
            "initial_capital": account.initial_capital,
            "cash_balance": account.cash_balance,
            "total_value": total_value,
            "roi_pct": VirtualPortfolio.get_roi(db, account),
            "open_positions": len(positions),
            "positions": [
                {
                    "symbol": p.symbol,
                    "quantity": p.quantity,
                    "avg_entry": p.average_entry_price,
                    "current_price": p.current_price,
                    "unrealized_pnl_pct": p.unrealized_pnl_pct,
                }
                for p in positions
            ],
        }
