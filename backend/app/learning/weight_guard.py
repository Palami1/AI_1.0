class WeightGuard:
    """
    Safety constraints for all Dynamic Weight adjustments.
    Ensures the Learning System cannot destabilize the AI.
    """
    
    MAX_ADJUSTMENT_PER_CYCLE = 0.05      # ±5% max per optimization round
    MIN_PREDICTIONS_REQUIRED = 100        # Must have ≥100 predictions before any change
    RISK_AGENT_MINIMUM_WEIGHT = 0.15      # Risk Agent weight floor — permanent
    WEIGHT_SUM_TOLERANCE = 0.001          # Floating point tolerance for sum = 100%
    
    @staticmethod
    def validate(
        agent_name: str,
        current_weight: float,
        proposed_weight: float,
        prediction_count: int,
        all_proposed_weights: dict
    ) -> dict:
        """
        Runs all safety checks before applying a weight change.
        Returns a dict: { valid: bool, reason: str }
        """
        # Rule 1: Minimum data requirement
        if prediction_count < WeightGuard.MIN_PREDICTIONS_REQUIRED:
            return {
                "valid": False,
                "reason": f"Insufficient data: only {prediction_count} predictions. Need ≥{WeightGuard.MIN_PREDICTIONS_REQUIRED}."
            }
        
        # Rule 2: Max adjustment per cycle (±5%)
        delta = abs(proposed_weight - current_weight)
        if delta > WeightGuard.MAX_ADJUSTMENT_PER_CYCLE:
            return {
                "valid": False,
                "reason": f"Adjustment of {delta*100:.2f}% exceeds the ±5% limit per cycle."
            }
        
        # Rule 3: Risk Agent weight floor
        if agent_name.lower() == "risk" and proposed_weight < WeightGuard.RISK_AGENT_MINIMUM_WEIGHT:
            return {
                "valid": False,
                "reason": f"Risk Agent cannot be reduced below {WeightGuard.RISK_AGENT_MINIMUM_WEIGHT*100:.0f}%. PERMANENT RULE."
            }
        
        # Rule 4: All weights must sum to 100%
        total = sum(all_proposed_weights.values())
        if abs(total - 1.0) > WeightGuard.WEIGHT_SUM_TOLERANCE:
            return {
                "valid": False,
                "reason": f"Proposed weights sum to {total*100:.2f}%. Must equal 100% exactly."
            }
        
        return {"valid": True, "reason": "All safety checks passed."}
