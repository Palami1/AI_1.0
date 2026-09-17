from datetime import datetime, timedelta
from app.database.session import SessionLocal
from app.models.base import AgentPerformance, MarketData
from app.learning.reward import RewardSystem

class OutcomeEvaluator:
    """
    Evaluates PENDING agent predictions after T+7 days.
    """
    
    EVALUATION_WINDOW_DAYS = 7
    PROFIT_THRESHOLD_PCT = 2.0 # Minimum 2% gain to be considered a 'WIN' for BUY
    
    @staticmethod
    def evaluate_pending_predictions():
        """
        Scans DB for predictions older than 7 days and scores them.
        """
        db = SessionLocal()
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=OutcomeEvaluator.EVALUATION_WINDOW_DAYS)
            
            # Find all pending predictions older than 7 days
            pending_records = db.query(AgentPerformance).filter(
                AgentPerformance.actual_result == "PENDING",
                AgentPerformance.created_at <= cutoff_date
            ).all()
            
            for record in pending_records:
                # 1. Fetch Entry Price (price at the time of prediction)
                entry_data = db.query(MarketData).filter(
                    MarketData.stock_id == record.symbol,
                    MarketData.timestamp >= record.created_at
                ).order_by(MarketData.timestamp.asc()).first()
                
                # 2. Fetch Exit Price (price at T+7 days)
                exit_date = record.created_at + timedelta(days=OutcomeEvaluator.EVALUATION_WINDOW_DAYS)
                exit_data = db.query(MarketData).filter(
                    MarketData.stock_id == record.symbol,
                    MarketData.timestamp >= exit_date
                ).order_by(MarketData.timestamp.asc()).first()
                
                if not entry_data or not exit_data:
                    continue # Not enough market data to evaluate yet
                    
                entry_price = entry_data.close
                exit_price = exit_data.close
                
                # 3. Calculate Result
                profit_loss_pct = ((exit_price - entry_price) / entry_price) * 100
                
                if profit_loss_pct >= OutcomeEvaluator.PROFIT_THRESHOLD_PCT:
                    actual_result = "WIN"
                elif profit_loss_pct <= -OutcomeEvaluator.PROFIT_THRESHOLD_PCT:
                    actual_result = "LOSS"
                else:
                    actual_result = "NEUTRAL"
                    
                # 4. Apply Reward
                reward_score = RewardSystem.calculate_reward(record.prediction, actual_result, profit_loss_pct)
                
                # 5. Update Record
                record.actual_result = actual_result
                record.profit_loss = round(profit_loss_pct, 2)
                record.accuracy_score = reward_score
                
            db.commit()
            print(f"Evaluated {len(pending_records)} predictions.")
            
        except Exception as e:
            db.rollback()
            print(f"Error evaluating predictions: {e}")
        finally:
            db.close()
