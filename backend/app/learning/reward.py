class RewardSystem:
    """
    Assigns reward points to AI Agents based on prediction accuracy and risk behavior.
    """
    
    # Reward Points
    CORRECT_BUY = 10.0
    CORRECT_SELL = 10.0
    CORRECT_WAIT = 5.0  # Reward for successfully avoiding a losing trade
    WRONG_BUY = -10.0
    WRONG_SELL = -10.0
    RISK_VIOLATION = -20.0 # High Risk Mistake (e.g. buying when overleveraged)

    @staticmethod
    def calculate_reward(prediction: str, actual_result: str, profit_loss_pct: float) -> float:
        """
        Calculates the score an agent receives based on the outcome.
        """
        if actual_result == "WIN":
            if prediction == "BUY":
                return RewardSystem.CORRECT_BUY
            elif prediction == "SELL":
                return RewardSystem.CORRECT_SELL
            elif prediction == "WAIT":
                # They waited, but the market went up (Missed opportunity)
                # No penalty, but no reward.
                return 0.0
        elif actual_result == "LOSS":
            if prediction == "BUY":
                # Market went down, they said BUY -> Penalty
                return RewardSystem.WRONG_BUY
            elif prediction == "SELL":
                # Market went up, they said SELL -> Penalty
                return RewardSystem.WRONG_SELL
            elif prediction == "WAIT":
                # Market went down, they correctly avoided it -> Reward
                return RewardSystem.CORRECT_WAIT
                
        return 0.0
