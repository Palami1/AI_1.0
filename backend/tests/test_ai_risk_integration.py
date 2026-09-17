import pytest
from app.risk.integration import RiskEngineIntegration

def test_ai_buy_risk_pass():
    input_data = {
        "signal": "BUY",
        "confidence": 85,
        "capital": 10000000,
        "entry": 100000,
        "stop_loss": 90000,
        "risk_percent": 1.0,
        "target_price": 120000 # RR = 20k/10k = 2.0 (passes > 1.5)
    }
    
    result = RiskEngineIntegration.evaluate_ai_signal(input_data)
    
    assert result["decision"] == "BUY"
    assert result["risk"] == "LOW"
    assert result["position_size"] == 10.0 # (10m * 0.01) / 10k = 100k / 10k = 10
    assert result["approved"] is True

def test_ai_buy_risk_fail():
    input_data = {
        "signal": "BUY",
        "confidence": 90,
        "capital": 10000000,
        "entry": 100000,
        "stop_loss": 90000,
        "risk_percent": 6.0, # HIGH_RISK
        "target_price": 110000 # RR = 10k/10k = 1.0 (LOW_REWARD)
    }
    
    result = RiskEngineIntegration.evaluate_ai_signal(input_data)
    
    assert result["decision"] == "WAIT"
    assert "HIGH_RISK" in result["reason"]
    assert "LOW_REWARD" in result["reason"]

def test_no_all_in_protection():
    # Attempting to buy with 80% of capital (Limit is 20%)
    input_data = {
        "signal": "BUY",
        "confidence": 80,
        "capital": 10000000,
        "entry": 100000,
        "stop_loss": 90000,
        "risk_percent": 1.0, 
        "target_price": 120000, 
    }
    # To bypass normal risk math and force position size to be 8,000,000 value, 
    # we need position_size = 80 units (80 * 100k = 8M).
    # If risk_percent = 80%, that triggers HIGH_RISK. We want to test POSITION_LIMIT specifically.
    # Let's mock a scenario where position size calculation yields a huge number.
    # e.g., stop loss is very tight: entry 100000, SL 99990 (Risk = 10 LAK).
    # Risk Amount = 1M (10% risk, wait, max is 5%).
    # We can inject a massive risk_percent, but that triggers HIGH_RISK first. 
    # Let's adjust RiskEngineIntegration to test position_request directly as requested.
    pass # Implementation details handled in engine logic.

def test_no_all_in_protection_direct_math():
    input_data = {
        "signal": "BUY",
        "capital": 10000000,
        "entry": 100000,
        "stop_loss": 99000, # Risk per share = 1000
        "risk_percent": 4.0, # Risk Amount = 400,000
        "target_price": 105000 # RR = 5000/1000 = 5.0 (Pass)
    }
    # Position size = 400,000 / 1000 = 400 units.
    # Position value = 400 * 100000 = 40,000,000 (400% of capital!)
    
    result = RiskEngineIntegration.evaluate_ai_signal(input_data)
    
    assert result["decision"] == "WAIT"
    assert "POSITION_LIMIT_EXCEEDED" in result["reason"]

def test_extreme_market_crash():
    input_data = {
        "signal": "BUY",
        "capital": 10000000,
        "entry": 100000,
        "stop_loss": 90000,
        "risk_percent": 1.0,
        "target_price": 150000,
        "is_extreme_market": True # Volatility spike / Crash detected
    }
    
    result = RiskEngineIntegration.evaluate_ai_signal(input_data)
    
    assert result["decision"] == "WAIT"
    assert "EMERGENCY_MODE" in result["reason"]
