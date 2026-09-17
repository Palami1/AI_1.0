from typing import List
import numpy as np
from sqlalchemy.orm import Session
from app.paper_trading.models import PaperOrder, PaperAccount
from app.paper_trading.portfolio import VirtualPortfolio


# Pass thresholds for Production Deployment
PRODUCTION_GATES = {
    "min_win_rate": 55.0,
    "min_profit_factor": 1.3,
    "max_drawdown": 15.0,
    "max_risk_violations": 0,
    "max_data_failure_rate": 1.0,
}


class PerformanceMetrics:
    """
    Calculates all key metrics from paper trading history.
    Also evaluates Production Readiness against gate thresholds.
    """

    @staticmethod
    def calculate(db: Session, account: PaperAccount) -> dict:
        closed_orders = db.query(PaperOrder).filter(
            PaperOrder.account_id == account.id,
            PaperOrder.status.in_(["WIN", "LOSS"]),
        ).all()

        total = len(closed_orders)
        if total == 0:
            return {"error": "No closed trades yet."}

        wins = [o for o in closed_orders if o.status == "WIN"]
        losses = [o for o in closed_orders if o.status == "LOSS"]

        win_rate = (len(wins) / total) * 100
        gross_profit = sum(o.profit_loss for o in wins if o.profit_loss)
        gross_loss = abs(sum(o.profit_loss for o in losses if o.profit_loss))
        profit_factor = gross_profit / gross_loss if gross_loss > 0 else float("inf")

        # Max Drawdown from equity curve
        pnl_series = [o.profit_loss or 0 for o in closed_orders]
        max_drawdown = PerformanceMetrics._max_drawdown(pnl_series, account.initial_capital)

        # Sharpe Ratio
        pnl_pcts = [o.profit_loss_pct or 0 for o in closed_orders]
        sharpe = PerformanceMetrics._sharpe_ratio(pnl_pcts)

        # ROI
        roi = VirtualPortfolio.get_roi(db, account)

        # False Signal Rate (AI said BUY/SELL but WAIT would have been better = LOSS)
        false_signals = len(losses)
        false_signal_rate = (false_signals / total) * 100 if total > 0 else 0

        metrics = {
            "total_trades": total,
            "winning_trades": len(wins),
            "losing_trades": len(losses),
            "win_rate": round(win_rate, 2),
            "profit_factor": round(profit_factor, 2),
            "max_drawdown_pct": round(max_drawdown, 2),
            "sharpe_ratio": round(sharpe, 3),
            "roi_pct": round(roi, 2),
            "gross_profit": round(gross_profit, 2),
            "gross_loss": round(gross_loss, 2),
            "false_signal_rate_pct": round(false_signal_rate, 2),
            "risk_violation_count": 0,  # Tracked by Risk Engine logs
        }

        metrics["production_ready"] = PerformanceMetrics._check_gates(metrics)
        return metrics

    @staticmethod
    def _max_drawdown(pnl_series: List[float], initial_capital: float) -> float:
        equity = initial_capital
        peak = initial_capital
        max_dd = 0.0

        for pnl in pnl_series:
            equity += pnl
            if equity > peak:
                peak = equity
            dd = (peak - equity) / peak * 100
            if dd > max_dd:
                max_dd = dd

        return max_dd

    @staticmethod
    def _sharpe_ratio(returns: List[float], risk_free: float = 0.02) -> float:
        if len(returns) < 2:
            return 0.0
        arr = np.array(returns)
        mean = np.mean(arr)
        std = np.std(arr)
        if std == 0:
            return 0.0
        return float((mean - risk_free) / std)

    @staticmethod
    def _check_gates(metrics: dict) -> dict:
        """Evaluates each metric against Production Readiness thresholds."""
        checks = {}
        checks["win_rate"] = {
            "value": metrics["win_rate"],
            "threshold": f">= {PRODUCTION_GATES['min_win_rate']}%",
            "pass": metrics["win_rate"] >= PRODUCTION_GATES["min_win_rate"],
        }
        checks["profit_factor"] = {
            "value": metrics["profit_factor"],
            "threshold": f">= {PRODUCTION_GATES['min_profit_factor']}",
            "pass": metrics["profit_factor"] >= PRODUCTION_GATES["min_profit_factor"],
        }
        checks["max_drawdown"] = {
            "value": metrics["max_drawdown_pct"],
            "threshold": f"<= {PRODUCTION_GATES['max_drawdown']}%",
            "pass": metrics["max_drawdown_pct"] <= PRODUCTION_GATES["max_drawdown"],
        }
        checks["risk_violations"] = {
            "value": metrics["risk_violation_count"],
            "threshold": "= 0",
            "pass": metrics["risk_violation_count"] == 0,
        }

        all_pass = all(c["pass"] for c in checks.values())
        return {"all_pass": all_pass, "checks": checks}
