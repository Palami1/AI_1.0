import numpy as np
from typing import List

class RiskMetrics:
    
    @staticmethod
    def calculate_max_drawdown(peak_value: float, current_value: float) -> float:
        """
        Calculates Maximum Drawdown as a percentage.
        """
        if peak_value <= 0:
            return 0.0
        drawdown = (peak_value - current_value) / peak_value
        return max(0.0, drawdown * 100.0)

    @staticmethod
    def calculate_sharpe_ratio(returns: List[float], risk_free_rate: float = 0.02) -> float:
        """
        Calculates the Sharpe Ratio.
        """
        if len(returns) < 2:
            return 0.0
            
        returns_array = np.array(returns)
        mean_return = np.mean(returns_array)
        std_dev = np.std(returns_array)
        
        if std_dev == 0:
            return 0.0
            
        # Annualized logic simplified for OS scope
        sharpe = (mean_return - risk_free_rate) / std_dev
        return float(sharpe)

    @staticmethod
    def determine_risk_score_status(score: float) -> str:
        """
        Maps a 0-100 Risk Score to a system status.
        """
        if score <= 30:
            return "Safe"
        elif score <= 60:
            return "Moderate"
        elif score <= 80:
            return "Danger"
        else:
            return "Stop Trading"
