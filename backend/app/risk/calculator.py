class RiskCalculator:
    """
    Core math operations for the Risk Engine.
    """
    
    @staticmethod
    def calculate_position_size(capital: float, risk_percent: float, entry_price: float, stop_loss: float) -> float:
        """
        Calculates position size based on capital, risk percentage, entry, and stop loss.
        """
        if entry_price <= 0 or stop_loss <= 0 or entry_price == stop_loss:
            return 0.0
            
        risk_amount = capital * (risk_percent / 100.0)
        risk_per_share = abs(entry_price - stop_loss)
        
        position_size = risk_amount / risk_per_share
        return position_size

    @staticmethod
    def calculate_risk_reward(entry_price: float, stop_loss: float, target_price: float) -> float:
        """
        Calculates Risk/Reward Ratio.
        """
        risk = abs(entry_price - stop_loss)
        reward = abs(target_price - entry_price)
        
        if risk == 0:
            return 0.0
            
        return reward / risk

    @staticmethod
    def calculate_atr_stop_loss(entry_price: float, atr_value: float, multiplier: float = 2.0, is_long: bool = True) -> float:
        """
        Calculates Stop Loss using Average True Range (ATR).
        """
        if is_long:
            return entry_price - (atr_value * multiplier)
        else:
            return entry_price + (atr_value * multiplier)
