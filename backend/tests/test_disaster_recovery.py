import pytest
from unittest.mock import patch, MagicMock
import pandas as pd

def test_dr_ai_engine_failure_forces_wait():
    """
    Test 3: AI Engine Failure
    If any agent or logic fails entirely, the try/except in generate_decision
    must intercept and return a safe WAIT decision.
    """
    from app.ai.engine import DecisionEngine
    engine = DecisionEngine()
    
    # Mock WeightOptimizer to throw an exception
    with patch('app.learning.optimizer.WeightOptimizer.optimize', side_effect=Exception("Database lock error")):
        df = pd.DataFrame({"close": [100.0]})
        decision = engine.generate_decision("BTC/USDT", df, {})
        
        assert decision["action"] == "WAIT"
        assert decision["confidence"] == 0.0
        assert "Internal AI Engine Error" in decision["weakness"][0]

def test_dr_market_api_failure_failover():
    """
    Test 2: Market API Failure
    Orchestrator must gracefully failover from Binance to Yahoo.
    """
    from app.services.market_data.collector import MarketDataOrchestrator
    orch = MarketDataOrchestrator()
    
    with patch.object(orch.binance, 'is_available', return_value=False):
        provider = orch._select_provider("BTC/USDT")
        assert provider.name == "yahoo", "Must failover to Yahoo when Binance is down"

def test_dr_learning_system_failure_freezes_weight():
    """
    Test 4: Learning System Failure
    If the optimizer throws an error, the WeightOptimizer must handle it
    or the weights remain unchanged. The AI system uses its safe in-memory weights.
    """
    from app.learning.optimizer import WeightOptimizer
    
    initial_weights = {"trend": 0.25, "momentum": 0.20}
    
    # Mocking internal DB query to fail
    with patch('app.database.session.SessionLocal', side_effect=Exception("DB Connection Timeout")):
        new_weights = WeightOptimizer.optimize(initial_weights)
        # Should fallback to returning the safe original weights rather than crashing
        assert new_weights == initial_weights, "Should freeze weights on Learning System DB failure"
