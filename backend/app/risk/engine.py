from app.risk.calculator import RiskCalculator
from app.risk.rules import RiskRules
from app.risk.models import RiskCalculationRequest, RiskCalculationResponse
from app.database.session import SessionLocal
from app.models.base import RiskLog

class RiskEngine:
    """
    Orchestrates Risk Calculations, Rule Validations, and Logging.
    """
    
    @staticmethod
    def evaluate_trade(request: RiskCalculationRequest, user_id: str = None) -> RiskCalculationResponse:
        
        # 1. Determine Risk Level
        risk_level = RiskRules.evaluate_risk_level(request.risk_percent)
        
        if risk_level == "HIGH":
            decision = "WAIT"
            reason = "Risk percentage > 5%. Forced WAIT to protect capital."
            return RiskEngine._build_response(0, 0, risk_level, 0, decision, reason, request, user_id)

        # 2. Calculate Math
        position_size = RiskCalculator.calculate_position_size(
            request.capital, request.risk_percent, request.entry, request.stop_loss
        )
        max_loss = request.capital * (request.risk_percent / 100.0)
        
        risk_reward = None
        if request.target_price:
            risk_reward = RiskCalculator.calculate_risk_reward(request.entry, request.stop_loss, request.target_price)

        # 3. Rule Validation (RR Ratio & Position Limit)
        position_value = position_size * request.entry
        validation = RiskRules.check_trade_validity(risk_reward if risk_reward else 0, position_value, request.capital)
        
        if not validation["valid"]:
            decision = "WAIT"
            reason = validation["reason"]
            # Even if position size is calculated, we override decision to WAIT
            return RiskEngine._build_response(position_size, max_loss, risk_level, risk_reward, decision, reason, request, user_id)
            
        # If MEDIUM risk, we might want to forcefully reduce position size (e.g., half it)
        if risk_level == "MEDIUM":
            position_size = position_size * 0.5
            max_loss = max_loss * 0.5
            decision = "ALLOW_WITH_REDUCED_SIZE"
            reason = "Risk is MEDIUM (2-5%). Position size halved for protection."
        else:
            decision = "ALLOW"
            reason = "Trade parameters passed all risk checks."
            
        return RiskEngine._build_response(position_size, max_loss, risk_level, risk_reward, decision, reason, request, user_id)

    @staticmethod
    def _build_response(position_size, max_loss, risk_level, risk_reward, decision, reason, request, user_id) -> RiskCalculationResponse:
        response = RiskCalculationResponse(
            position_size=position_size,
            max_loss=max_loss,
            risk_level=risk_level,
            risk_reward=risk_reward,
            decision=decision,
            reason=reason
        )
        
        # Log to DB for Learning System later
        if user_id:
            RiskEngine._log_risk_event(user_id, request.capital, max_loss, position_size)
            
        return response

    @staticmethod
    def _log_risk_event(user_id: str, capital: float, max_loss: float, position_size: float):
        db = SessionLocal()
        try:
            log = RiskLog(
                user_id=user_id,
                capital=capital,
                risk_score=max_loss/capital if capital > 0 else 0,
                position_size=position_size,
                max_loss=max_loss
            )
            db.add(log)
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Failed to log risk event: {e}")
        finally:
            db.close()
