import os
from app.database.session import SessionLocal
from app.models.base import AgentWeightHistory

class LearningSafety:
    """
    Safety rules to prevent the AI from breaking itself during weight adjustments.
    Includes a Human Override (ADMIN_LOCK) for emergency situations.
    """
    
    MAX_WEIGHT_CHANGE_PERCENT = 0.05
    MIN_PREDICTIONS_REQUIRED = 100
    MIN_RISK_AGENT_WEIGHT = 0.15
    
    @staticmethod
    def is_admin_locked() -> bool:
        """
        Checks for ADMIN_LOCK environment variable.
        Set ADMIN_LOCK=true to halt all learning and trigger rollback.
        """
        return os.environ.get("ADMIN_LOCK", "false").lower() == "true"

    @staticmethod
    def validate_weight_adjustment(
        agent_name: str,
        current_weight: float,
        proposed_weight: float,
        prediction_count: int
    ) -> dict:
        # Human Override: if Admin has locked learning, block ALL adjustments
        if LearningSafety.is_admin_locked():
            return {
                "valid": False,
                "reason": "ADMIN_LOCK is active. Learning System is halted. Contact administrator."
            }
        
        if prediction_count < LearningSafety.MIN_PREDICTIONS_REQUIRED:
            return {"valid": False, "reason": f"Not enough data. Need {LearningSafety.MIN_PREDICTIONS_REQUIRED} predictions."}
            
        change = abs(proposed_weight - current_weight)
        if change > LearningSafety.MAX_WEIGHT_CHANGE_PERCENT:
            return {"valid": False, "reason": f"Weight change ({change*100}%) exceeds maximum limit (5%)."}
            
        if agent_name.lower() == "risk" and proposed_weight < LearningSafety.MIN_RISK_AGENT_WEIGHT:
            return {"valid": False, "reason": f"Risk Agent weight cannot go below {LearningSafety.MIN_RISK_AGENT_WEIGHT*100}%."}
            
        return {"valid": True, "reason": "Adjustment safe."}

    @staticmethod
    def emergency_rollback(agent_name: str) -> dict:
        """
        Triggered when ADMIN_LOCK is detected.
        Rolls back to the previous stable weight for the given agent.
        """
        db = SessionLocal()
        try:
            # Get the second-to-last weight history record (previous stable state)
            history = db.query(AgentWeightHistory).filter(
                AgentWeightHistory.agent_name == agent_name
            ).order_by(AgentWeightHistory.created_at.desc()).offset(1).first()
            
            if history:
                return {
                    "agent": agent_name,
                    "rolled_back_to": history.new_weight,
                    "message": f"Weight restored to {history.new_weight*100:.1f}%"
                }
            return {"agent": agent_name, "message": "No previous weight history found."}
        finally:
            db.close()
