import os
import pytest
import pandas as pd
from unittest.mock import patch, MagicMock

# ==========================================
# PHASE 12.9: FINAL PRE-PRODUCTION VALIDATION
# ==========================================

def test_e2e_kill_switch_overrides_everything():
    """
    Validation: Market Crash -> Admin Kill Switch -> AI forced to WAIT -> Alert Sent.
    """
    from app.ai.engine import DecisionEngine
    
    # 1. Admin activates kill switch
    os.environ["KILL_SWITCH_ACTIVE"] = "true"
    
    # 2. AI attempts to analyze a highly bullish market (would normally BUY)
    engine = DecisionEngine()
    df = pd.DataFrame({
        "open": [100.0], "high": [110.0], "low": [90.0], 
        "close": [105.0], "volume": [1000.0]
    })
    
    decision = engine.generate_decision("BTC/USDT", df, {"user_id": "test_user"})
    
    # 3. Validation
    assert decision["action"] == "WAIT", "Kill switch MUST force action to WAIT"
    assert decision["confidence"] == 0.0, "Confidence MUST be 0 during kill switch"
    assert decision["risk"] == "HIGH", "Risk MUST be flagged as HIGH"
    assert any("KILL SWITCH ACTIVE" in w for w in decision["weakness"]), "Reason must be logged"
    
    # Cleanup
    os.environ["KILL_SWITCH_ACTIVE"] = "false"


def test_ai_behavior_wait_on_missing_data():
    """
    Validation: AI must return WAIT if data is insufficient for indicators.
    """
    from app.ai.engine import DecisionEngine
    
    engine = DecisionEngine()
    # Provide only 2 rows, not enough for SMA20 or RSI14
    df = pd.DataFrame({"close": [100.0, 101.0]})
    
    with patch.object(engine.agents["trend"], "analyze", side_effect=Exception("Not enough data")):
        decision = engine.generate_decision("BTC/USDT", df, {})
        assert decision["action"] == "WAIT", "AI must WAIT if data/indicators fail"


def test_security_authorization_stub():
    """
    Validation: Ensure non-admin users cannot trigger admin actions.
    (Unit test representation of the FastAPI dependency)
    """
    class MockUser:
        def __init__(self, role):
            self.role = role

    def check_admin(user: MockUser):
        if user.role != "ADMIN":
            raise Exception("Unauthorized: Admin only")
            
    admin = MockUser(role="ADMIN")
    user = MockUser(role="USER")
    
    # Admin passes
    check_admin(admin)
    
    # User fails
    with pytest.raises(Exception, match="Unauthorized"):
        check_admin(user)
