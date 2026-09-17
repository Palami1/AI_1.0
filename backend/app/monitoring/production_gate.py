from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.paper_trading.models import PaperAccount, PaperOrder, PerformanceReport
from app.paper_trading.metrics import PerformanceMetrics, PRODUCTION_GATES
from app.paper_trading.portfolio import VirtualPortfolio


# Enhanced thresholds (Phase 12.5 upgrade)
ENHANCED_GATES = {
    **PRODUCTION_GATES,
    "min_trading_days": 60,
    "min_total_trades": 100,
    "max_data_downtime_pct": 1.0,
}


class ProductionGate:
    """
    Full production readiness check.
    All gates must pass before Phase 13 deployment is approved.
    """

    @staticmethod
    def evaluate(db: Session, account: PaperAccount) -> dict:
        checks = {}

        # 1. Metrics-based gates
        metrics = PerformanceMetrics.calculate(db, account)
        if "error" in metrics:
            return {"all_pass": False, "reason": "No closed trades yet.", "checks": {}}

        checks["win_rate"] = {
            "value": f"{metrics['win_rate']}%",
            "threshold": f"≥ {ENHANCED_GATES['min_win_rate']}%",
            "pass": metrics["win_rate"] >= ENHANCED_GATES["min_win_rate"],
        }
        checks["profit_factor"] = {
            "value": metrics["profit_factor"],
            "threshold": f"≥ {ENHANCED_GATES['min_profit_factor']}",
            "pass": metrics["profit_factor"] >= ENHANCED_GATES["min_profit_factor"],
        }
        checks["max_drawdown"] = {
            "value": f"{metrics['max_drawdown_pct']}%",
            "threshold": f"≤ {ENHANCED_GATES['max_drawdown']}%",
            "pass": metrics["max_drawdown_pct"] <= ENHANCED_GATES["max_drawdown"],
        }
        checks["risk_violations"] = {
            "value": metrics["risk_violation_count"],
            "threshold": "= 0",
            "pass": metrics["risk_violation_count"] == 0,
        }

        # 2. Trading duration ≥60 days
        first_order = db.query(PaperOrder).filter(
            PaperOrder.account_id == account.id
        ).order_by(PaperOrder.opened_at.asc()).first()

        trading_days = 0
        if first_order:
            trading_days = (datetime.utcnow() - first_order.opened_at.replace(tzinfo=None)).days

        checks["trading_duration"] = {
            "value": f"{trading_days} days",
            "threshold": f"≥ {ENHANCED_GATES['min_trading_days']} days",
            "pass": trading_days >= ENHANCED_GATES["min_trading_days"],
        }

        # 3. Minimum trades ≥100
        total_closed = db.query(PaperOrder).filter(
            PaperOrder.account_id == account.id,
            PaperOrder.status.in_(["WIN", "LOSS"]),
        ).count()

        checks["total_trades"] = {
            "value": total_closed,
            "threshold": f"≥ {ENHANCED_GATES['min_total_trades']}",
            "pass": total_closed >= ENHANCED_GATES["min_total_trades"],
        }

        # 4. Manual audit and Emergency Test — requires human sign-off (tracked via env flag)
        import os
        checks["emergency_test_passed"] = {
            "value": os.environ.get("EMERGENCY_TEST_PASSED", "false"),
            "threshold": "= true",
            "pass": os.environ.get("EMERGENCY_TEST_PASSED", "false").lower() == "true",
        }
        checks["manual_audit_passed"] = {
            "value": os.environ.get("MANUAL_AUDIT_PASSED", "false"),
            "threshold": "= true",
            "pass": os.environ.get("MANUAL_AUDIT_PASSED", "false").lower() == "true",
        }

        all_pass = all(c["pass"] for c in checks.values())
        passed_count = sum(1 for c in checks.values() if c["pass"])

        return {
            "all_pass": all_pass,
            "passed": f"{passed_count}/{len(checks)}",
            "eligible_for_phase_13": all_pass,
            "checks": checks,
            "summary_metrics": {
                "roi_pct": metrics["roi_pct"],
                "sharpe_ratio": metrics["sharpe_ratio"],
                "total_trades": metrics["total_trades"],
            }
        }
