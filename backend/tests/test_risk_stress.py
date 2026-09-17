import pytest
from app.risk.integration import RiskEngineIntegration
from app.risk.calculator import RiskCalculator
from app.risk.rules import RiskRules

# ─────────────────────────────────────────────────────────
# SCENARIO A: Normal LOW Risk Trade
# ─────────────────────────────────────────────────────────

def test_scenario_a_position_size():
    """
    Capital: 10,000,000 LAK | Risk: 1% | Entry: 100 | SL: 95
    Expected Risk Amount : 100,000
    Expected Position Size: 20,000 units
    """
    capital = 10_000_000
    entry = 100
    stop_loss = 95
    risk_pct = 1.0
    
    position_size = RiskCalculator.calculate_position_size(capital, risk_pct, entry, stop_loss)
    risk_amount = capital * (risk_pct / 100.0)
    
    assert risk_amount == 100_000.0
    assert position_size == 20_000.0

def test_scenario_a_signal_approved():
    """Full signal flow — should be ALLOW."""
    result = RiskEngineIntegration.evaluate_ai_signal({
        "signal": "BUY",
        "capital": 10_000_000,
        "entry": 100,
        "stop_loss": 95,
        "risk_percent": 1.0,
        "target_price": 115  # RR = 15/5 = 3.0 (PASS)
    })
    assert result["decision"] == "BUY"
    assert result["risk"] == "LOW"
    assert result["approved"] is True

# ─────────────────────────────────────────────────────────
# SCENARIO B: Market Crash / Emergency Mode
# ─────────────────────────────────────────────────────────

def test_scenario_b_market_crash_emergency():
    """
    BTC -20%, VIX High, Drawdown >15%.
    Expected: WAIT with EMERGENCY_MODE reason.
    """
    result = RiskEngineIntegration.evaluate_ai_signal({
        "signal": "BUY",
        "capital": 10_000_000,
        "entry": 100_000,
        "stop_loss": 95_000,
        "risk_percent": 1.0,
        "target_price": 120_000,
        "is_extreme_market": True  # Crash flag triggered
    })
    assert result["decision"] == "WAIT"
    assert "EMERGENCY_MODE" in result["reason"]

def test_scenario_b_high_risk_blocks_buy():
    """Risk > 5% must force WAIT regardless of AI confidence."""
    result = RiskEngineIntegration.evaluate_ai_signal({
        "signal": "BUY",
        "capital": 10_000_000,
        "entry": 100_000,
        "stop_loss": 90_000,
        "risk_percent": 7.0,  # HIGH_RISK
        "target_price": 130_000
    })
    assert result["decision"] == "WAIT"
    assert "HIGH_RISK" in result["reason"]

# ─────────────────────────────────────────────────────────
# SCENARIO C: RR Ratio Gate
# ─────────────────────────────────────────────────────────

def test_scenario_c_low_rr_blocked():
    """RR < 1.5 must be blocked (LOW_REWARD)."""
    rr = RiskCalculator.calculate_risk_reward(entry_price=100, stop_loss=90, target_price=108)
    assert rr < 1.5  # Risk=10, Reward=8 → RR=0.8

    result = RiskEngineIntegration.evaluate_ai_signal({
        "signal": "BUY",
        "capital": 10_000_000,
        "entry": 100,
        "stop_loss": 90,
        "risk_percent": 1.0,
        "target_price": 108  # RR = 0.8 — FAIL
    })
    assert result["decision"] == "WAIT"
    assert "LOW_REWARD" in result["reason"]
