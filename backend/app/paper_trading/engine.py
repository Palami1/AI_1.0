from sqlalchemy.orm import Session
from app.paper_trading.portfolio import VirtualPortfolio
from app.paper_trading.order import VirtualOrderManager
from app.paper_trading.simulator import TradeSimulator
from app.paper_trading.metrics import PerformanceMetrics
from app.paper_trading.models import PaperAccount, PerformanceReport
from app.services.market_data.collector import MarketDataOrchestrator
from app.risk.calculator import RiskCalculator
from app.risk.rules import RiskRules
from app.database.session import SessionLocal


class PaperTradingEngine:
    """
    Full Paper Trading Orchestrator.
    1. Fetches market data
    2. Runs AI Multi-Agent system
    3. Validates through Risk Engine
    4. Places virtual orders
    5. Evaluates open positions against new prices
    6. Saves performance snapshots
    """

    def __init__(self, account_id: str):
        self.account_id = account_id
        self.market = MarketDataOrchestrator()

    def run_cycle(self, symbol: str, risk_percent: float = 1.0):
        """One full trading cycle for a given symbol."""
        db = SessionLocal()
        try:
            account = db.query(PaperAccount).filter(PaperAccount.id == self.account_id).first()
            if not account or not account.is_active:
                return {"status": "ERROR", "reason": "Account not found or inactive."}

            # 1. Fetch real market data with indicators
            df = self.market.get_latest_with_indicators(symbol, limit=200)
            if df is None:
                return {"status": "SKIPPED", "reason": "Data quality below threshold."}

            # 2. Run AI Decision Engine
            from app.ai.engine import DecisionEngine
            engine = DecisionEngine()
            context = {"user_id": None, "risk_level": "LOW"}
            decision = engine.generate_decision(symbol, df, context)

            if decision["action"] == "WAIT":
                return {"status": "WAIT", "symbol": symbol, "reason": decision["weakness"]}

            # 3. Risk Engine — calculate position size
            latest = df.iloc[-1]
            entry = float(latest["close"])
            stop_loss_distance = entry * 0.05  # 5% stop loss default
            stop_loss = entry - stop_loss_distance
            take_profit = entry + (stop_loss_distance * 2)  # 1:2 RR

            position_size = RiskCalculator.calculate_position_size(
                capital=account.cash_balance,
                risk_percent=risk_percent,
                entry_price=entry,
                stop_loss=stop_loss,
            )

            risk_level = RiskRules.evaluate_risk_level(risk_percent)
            if risk_level == "HIGH":
                return {"status": "BLOCKED", "reason": "Risk too high."}

            if position_size <= 0:
                return {"status": "SKIPPED", "reason": "Position size too small."}

            # 4. Place Virtual Order
            result = VirtualOrderManager.place_order(
                db=db, account=account,
                symbol=symbol, action=decision["action"],
                entry_price=entry, stop_loss=stop_loss,
                take_profit=take_profit, quantity=position_size,
                ai_confidence=decision["confidence"],
                ai_risk_level=decision["risk"],
                ai_evidence=decision.get("evidence", []),
            )

            # 5. Evaluate open orders (could hit TP/SL immediately in backtesting)
            current_prices = {symbol: entry}
            TradeSimulator.evaluate_open_orders(db, str(account.id), current_prices)

            return {
                "status": "CYCLE_COMPLETE",
                "symbol": symbol,
                "ai_decision": decision["action"],
                "confidence": decision["confidence"],
                "order": result,
            }

        except Exception as e:
            db.rollback()
            return {"status": "ERROR", "reason": str(e)}
        finally:
            db.close()

    def save_performance_snapshot(self):
        """Persists today's metrics to performance_reports table."""
        db = SessionLocal()
        try:
            account = db.query(PaperAccount).filter(PaperAccount.id == self.account_id).first()
            if not account:
                return

            metrics = PerformanceMetrics.calculate(db, account)
            if "error" in metrics:
                return

            report = PerformanceReport(
                account_id=account.id,
                total_trades=metrics["total_trades"],
                winning_trades=metrics["winning_trades"],
                losing_trades=metrics["losing_trades"],
                win_rate=metrics["win_rate"],
                profit_factor=metrics["profit_factor"],
                max_drawdown=metrics["max_drawdown_pct"],
                sharpe_ratio=metrics["sharpe_ratio"],
                roi=metrics["roi_pct"],
                false_signal_rate=metrics["false_signal_rate_pct"],
                portfolio_value=VirtualPortfolio.get_total_value(db, account),
                metrics_snapshot=metrics,
            )
            db.add(report)
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Failed to save snapshot: {e}")
        finally:
            db.close()
