class RiskRules:
    """
    Evaluates risk rules and limits to ensure capital protection.
    """
    
    MAX_POSITION_LIMIT_PERCENT = 20.0
    MIN_RISK_REWARD_RATIO = 1.5
    
    @staticmethod
    def evaluate_risk_level(risk_percent: float) -> str:
        if risk_percent < 2.0:
            return "LOW"
        elif 2.0 <= risk_percent <= 5.0:
            return "MEDIUM"
        else:
            return "HIGH"

    @staticmethod
    def check_trade_validity(risk_reward: float, position_size_value: float, capital: float, risk_percent: float, is_extreme_market: bool = False) -> dict:
        reasons = []
        valid = True
        
        if is_extreme_market:
            reasons.append("EMERGENCY_MODE")
            valid = False
            
        if risk_percent > 5.0:
            reasons.append("HIGH_RISK")
            valid = False
            
        if risk_reward > 0 and risk_reward < RiskRules.MIN_RISK_REWARD_RATIO:
            reasons.append("LOW_REWARD")
            valid = False
            
        position_percent = (position_size_value / capital) * 100
        if position_percent > RiskRules.MAX_POSITION_LIMIT_PERCENT:
             reasons.append("POSITION_LIMIT_EXCEEDED")
             valid = False
             
        if not valid:
            return {"valid": False, "reasons": reasons}
             
        return {"valid": True, "reasons": []}
