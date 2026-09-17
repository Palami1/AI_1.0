from datetime import datetime
from sqlalchemy.orm import Session
from app.paper_trading.models import PaperOrder, PaperAccount
from app.models.base import AgentPerformance


class TradeJournal:
    """
    Generates a detailed human-readable journal for every completed paper trade.
    Links trade outcome back to individual agent votes for learning.
    """

    @staticmethod
    def get_trade_journal(db: Session, account_id: str, limit: int = 50) -> list:
        orders = db.query(PaperOrder).filter(
            PaperOrder.account_id == account_id,
            PaperOrder.status.in_(["WIN", "LOSS", "OPEN"]),
        ).order_by(PaperOrder.opened_at.desc()).limit(limit).all()

        journal = []
        for order in orders:
            # Derive lesson from outcome
            lesson = TradeJournal._generate_lesson(order)

            journal.append({
                "trade_id": str(order.id)[:8].upper(),
                "symbol": order.symbol,
                "action": order.action,
                "ai_confidence": order.ai_confidence,
                "ai_risk_level": order.ai_risk_level,
                "entry_price": order.entry_price,
                "stop_loss": order.stop_loss,
                "take_profit": order.take_profit,
                "close_price": order.close_price,
                "status": order.status,
                "profit_loss": order.profit_loss,
                "profit_loss_pct": order.profit_loss_pct,
                "ai_evidence": order.ai_evidence or [],
                "opened_at": order.opened_at.isoformat(),
                "closed_at": order.closed_at.isoformat() if order.closed_at else None,
                "lesson": lesson,
            })

        return journal

    @staticmethod
    def _generate_lesson(order: PaperOrder) -> str:
        if order.status == "WIN":
            if order.ai_confidence and order.ai_confidence >= 75:
                return "High-confidence AI signal aligned with market direction. Agents in agreement."
            return "Lower confidence trade succeeded — market conditions were favorable."
        elif order.status == "LOSS":
            if order.stop_loss and order.close_price and order.close_price <= order.stop_loss:
                return "Stop Loss triggered correctly. Risk Engine protected capital as designed."
            return "AI signal was incorrect. Check agent weights and data quality for this period."
        return "Trade still open — awaiting TP/SL resolution."

    @staticmethod
    def get_agent_performance_summary(db: Session) -> dict:
        """Per-agent accuracy breakdown from agent_performance table."""
        from sqlalchemy import func
        agents = db.query(
            AgentPerformance.agent_name,
            func.count(AgentPerformance.id).label("total"),
            func.sum(
                (AgentPerformance.accuracy_score > 0).cast(int)  # type: ignore
            ).label("wins"),
            func.avg(AgentPerformance.confidence).label("avg_confidence"),
        ).filter(
            AgentPerformance.actual_result != "PENDING"
        ).group_by(AgentPerformance.agent_name).all()

        return {
            row.agent_name: {
                "total_predictions": row.total,
                "wins": row.wins or 0,
                "accuracy_pct": round(((row.wins or 0) / row.total) * 100, 1) if row.total > 0 else 0,
                "avg_confidence": round(float(row.avg_confidence or 0), 1),
            }
            for row in agents
        }
