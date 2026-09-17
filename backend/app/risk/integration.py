from app.risk.calculator import RiskCalculator
from app.risk.rules import RiskRules
from typing import Dict, Any

class RiskEngineIntegration:
    """
    Simulated API Integration Engine for AI & Risk Test (Phase 7.5).
    """
    
    @staticmethod
    def evaluate_ai_signal(signal_data: Dict[str, Any]) -> Dict[str, Any]:
        signal = signal_data.get("signal")
        capital = signal_data.get("capital")
        entry = signal_data.get("entry")
        stop_loss = signal_data.get("stop_loss")
        target_price = signal_data.get("target_price", 0)
        risk_percent = signal_data.get("risk_percent", 0) # Could be derived from entry/sl
        is_extreme = signal_data.get("is_extreme_market", False)
        
        # If AI says WAIT, we just pass WAIT
        if signal == "WAIT":
            return {"decision": "WAIT", "reason": ["AI_SIGNAL_WAIT"]}
            
        # Calculate Math
        position_size = RiskCalculator.calculate_position_size(capital, risk_percent, entry, stop_loss)
        risk_reward = RiskCalculator.calculate_risk_reward(entry, stop_loss, target_price) if target_price else 0
        
        # Check Rules
        position_value = position_size * entry
        validation = RiskRules.check_trade_validity(risk_reward, position_value, capital, risk_percent, is_extreme)
        
        if not validation["valid"]:
            return {
                "decision": "WAIT",
                "reason": validation["reasons"]
            }
            
        return {
            "decision": signal,
            "risk": RiskRules.evaluate_risk_level(risk_percent),
            "position_size": position_size,
            "approved": True
        }
