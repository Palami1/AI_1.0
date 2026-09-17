from pydantic import BaseModel
from typing import Optional

class RiskCalculationRequest(BaseModel):
    capital: float
    entry: float
    stop_loss: float
    risk_percent: float
    target_price: Optional[float] = None

class RiskCalculationResponse(BaseModel):
    position_size: float
    max_loss: float
    risk_level: str
    risk_reward: Optional[float]
    decision: str
    reason: str
