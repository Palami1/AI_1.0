from datetime import datetime
from sqlalchemy.orm import Session
from app.paper_trading.models import PaperAccount, PaperOrder, PaperPosition


class TradeSimulator:
    """
    Checks open paper orders against the current market price
    and resolves them as WIN (TP hit), LOSS (SL hit), or leaves OPEN.
    Called by the scheduler every time new market data arrives.
    """

    @staticmethod
    def evaluate_open_orders(db: Session, account_id: str, current_prices: dict):
        """
        current_prices: { "BTC/USDT": 67000.0, "ETH/USDT": 3400.0, ... }
        """
        open_orders = db.query(PaperOrder).filter(
            PaperOrder.account_id == account_id,
            PaperOrder.status == "OPEN",
        ).all()

        results = []
        for order in open_orders:
            price = current_prices.get(order.symbol)
            if price is None:
                continue

            result = TradeSimulator._check_order(db, order, price)
            if result:
                results.append(result)

        db.commit()
        return results

    @staticmethod
    def _check_order(db: Session, order: PaperOrder, current_price: float) -> dict | None:
        account = db.query(PaperAccount).filter(PaperAccount.id == order.account_id).first()

        # --- LONG (BUY) Position Resolution ---
        if order.action == "BUY":
            # Take Profit hit
            if order.take_profit and current_price >= order.take_profit:
                return TradeSimulator._close_order(db, account, order, current_price, "WIN")
            # Stop Loss hit
            if current_price <= order.stop_loss:
                return TradeSimulator._close_order(db, account, order, current_price, "LOSS")

        # --- SHORT (SELL) Position Resolution ---
        elif order.action == "SELL":
            if order.take_profit and current_price <= order.take_profit:
                return TradeSimulator._close_order(db, account, order, current_price, "WIN")
            if current_price >= order.stop_loss:
                return TradeSimulator._close_order(db, account, order, current_price, "LOSS")

        # Update unrealized PnL on the position
        TradeSimulator._update_unrealized(db, order, current_price)
        return None

    @staticmethod
    def _close_order(db: Session, account: PaperAccount, order: PaperOrder, close_price: float, result: str) -> dict:
        # Calculate P&L
        if order.action == "BUY":
            pnl = (close_price - order.entry_price) * order.quantity
        else:
            pnl = (order.entry_price - close_price) * order.quantity

        pnl_pct = ((close_price - order.entry_price) / order.entry_price) * 100
        if order.action == "SELL":
            pnl_pct = -pnl_pct

        # Update order record
        order.status = result
        order.close_price = close_price
        order.profit_loss = round(pnl, 2)
        order.profit_loss_pct = round(pnl_pct, 2)
        order.closed_at = datetime.utcnow()

        # Return cash to account
        account.cash_balance += (order.quantity * close_price) + max(pnl, 0)

        # Remove closed position
        pos = db.query(PaperPosition).filter(
            PaperPosition.account_id == account.id,
            PaperPosition.symbol == order.symbol,
        ).first()
        if pos:
            if pos.quantity <= order.quantity:
                db.delete(pos)
            else:
                pos.quantity -= order.quantity

        return {
            "order_id": str(order.id),
            "symbol": order.symbol,
            "result": result,
            "pnl": pnl,
            "pnl_pct": pnl_pct,
            "close_price": close_price,
        }

    @staticmethod
    def _update_unrealized(db: Session, order: PaperOrder, current_price: float):
        pos = db.query(PaperPosition).filter(
            PaperPosition.account_id == order.account_id,
            PaperPosition.symbol == order.symbol,
        ).first()
        if pos:
            pos.current_price = current_price
            pnl = (current_price - pos.average_entry_price) * pos.quantity
            pnl_pct = ((current_price - pos.average_entry_price) / pos.average_entry_price) * 100
            pos.unrealized_pnl = round(pnl, 2)
            pos.unrealized_pnl_pct = round(pnl_pct, 2)
