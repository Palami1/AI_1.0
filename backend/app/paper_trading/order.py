from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.paper_trading.models import PaperAccount, PaperOrder, PaperPosition


class VirtualOrderManager:
    """
    Creates and manages virtual BUY/SELL orders.
    """

    @staticmethod
    def place_order(
        db: Session,
        account: PaperAccount,
        symbol: str,
        action: str,
        entry_price: float,
        stop_loss: float,
        quantity: float,
        ai_confidence: float,
        ai_risk_level: str,
        take_profit: Optional[float] = None,
        ai_evidence: Optional[list] = None,
    ) -> dict:
        """Validates balance then creates the order record."""

        # Pre-check: enough cash for a BUY?
        if action == "BUY":
            required_cash = quantity * entry_price
            if required_cash > account.cash_balance:
                return {
                    "status": "REJECTED",
                    "reason": f"Insufficient cash. Need {required_cash:,.0f}, have {account.cash_balance:,.0f}."
                }
            account.cash_balance -= required_cash

        order = PaperOrder(
            account_id=account.id,
            symbol=symbol,
            action=action,
            quantity=quantity,
            entry_price=entry_price,
            stop_loss=stop_loss,
            take_profit=take_profit,
            ai_confidence=ai_confidence,
            ai_risk_level=ai_risk_level,
            status="OPEN",
            ai_evidence=ai_evidence or [],
        )
        db.add(order)

        # Upsert position
        existing_pos = db.query(PaperPosition).filter(
            PaperPosition.account_id == account.id,
            PaperPosition.symbol == symbol,
        ).first()

        if existing_pos:
            # Weighted average entry
            total_qty = existing_pos.quantity + quantity
            new_avg = (
                (existing_pos.quantity * existing_pos.average_entry_price) +
                (quantity * entry_price)
            ) / total_qty
            existing_pos.quantity = total_qty
            existing_pos.average_entry_price = new_avg
        else:
            pos = PaperPosition(
                account_id=account.id,
                symbol=symbol,
                quantity=quantity,
                average_entry_price=entry_price,
                current_price=entry_price,
                unrealized_pnl=0.0,
                unrealized_pnl_pct=0.0,
            )
            db.add(pos)

        db.commit()
        db.refresh(order)
        return {"status": "ORDER_CREATED", "order_id": str(order.id), "symbol": symbol, "action": action}

    @staticmethod
    def get_open_orders(db: Session, account_id: str) -> list:
        return db.query(PaperOrder).filter(
            PaperOrder.account_id == account_id,
            PaperOrder.status == "OPEN",
        ).all()
