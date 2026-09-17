from app.database.session import SessionLocal
from app.models.base import AgentPerformance

class AgentTracker:
    """
    Tracks predictions made by individual agents.
    Called by the DecisionEngine right before finalizing a trade.
    """
    
    @staticmethod
    def record_prediction(agent_name: str, symbol: str, prediction: str, confidence: float):
        """
        Stores the initial prediction with PENDING status.
        """
        db = SessionLocal()
        try:
            record = AgentPerformance(
                agent_name=agent_name,
                symbol=symbol,
                prediction=prediction,
                confidence=confidence,
                actual_result="PENDING"
            )
            db.add(record)
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Failed to record agent prediction: {e}")
        finally:
            db.close()
            
    @staticmethod
    def update_result(record_id: str, actual_result: str, profit_loss: float, accuracy_score: float):
        """
        Updates a PENDING prediction after the 7-day window.
        """
        db = SessionLocal()
        try:
            record = db.query(AgentPerformance).filter(AgentPerformance.id == record_id).first()
            if record:
                record.actual_result = actual_result
                record.profit_loss = profit_loss
                record.accuracy_score = accuracy_score
                db.commit()
        except Exception as e:
            db.rollback()
            print(f"Failed to update agent prediction: {e}")
        finally:
            db.close()
