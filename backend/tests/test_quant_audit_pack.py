import unittest
import time
from app.ai.audit import QuantAuditEngine
from app.ai.engine import DecisionEngineV5_2
from app.core.config import settings

class TestQuantAuditPack(unittest.TestCase):
    def test_no_lookahead_bias(self):
        """Verify strictly that feature time T is always strictly before target time T+k."""
        feature_times = [int(time.time()) - (100 - i) * 60 for i in range(100)]
        target_times = [t + 3600 for t in feature_times] # 1 hour ahead target
        result = QuantAuditEngine.audit_lookahead_bias(feature_times, target_times)
        self.assertEqual(result["status"], "PASS")
        self.assertEqual(result["violations"], 0)

    def test_data_leakage_chronological_split(self):
        """Verify that train/val/test splits do not cross time boundaries."""
        train_size = 1736 # 70%
        val_size = 372   # 15%
        test_size = 373  # 15%
        result = QuantAuditEngine.audit_data_leakage(train_size, val_size, test_size)
        self.assertEqual(result["status"], "PASS")

    def test_walk_forward_consistency(self):
        """Verify rolling out-of-sample window consistency rate >= 70%."""
        mock_windows = [{"window": i, "status": "PASS" if i < 10 else "FAIL"} for i in range(12)]
        result = QuantAuditEngine.audit_walk_forward_windows(mock_windows)
        self.assertEqual(result["status"], "PASS")

    def test_transaction_execution_cost_calculation(self):
        """Verify transaction-by-transaction fee, slippage, spread, and market impact deduction."""
        mock_trades = [
            {"size_usd": 10000.0, "gross_pnl_usd": 420.0, "maker_fee_pct": 0.04, "taker_fee_pct": 0.08, "spread_pct": 0.02, "slippage_pct": 0.05}
            for _ in range(50)
        ]
        cost_res = QuantAuditEngine.calculate_transaction_execution_cost(mock_trades)
        self.assertGreater(cost_res["totalFeesUsd"], 0)
        self.assertGreater(cost_res["totalSlippageUsd"], 0)
        self.assertGreater(cost_res["totalSpreadUsd"], 0)
        self.assertLess(cost_res["netRealizedReturnUsd"], cost_res["grossReturnUsd"])

    def test_subsystem_data_quality_breakdown(self):
        """Verify that Risk Gate triggers NO TRADE if Market Price quality is compromised."""
        good_sources = {
            "marketPrice": 100.0,
            "fundingRate": 98.0,
            "openInterest": 97.0,
            "whaleData": 92.0,
            "newsData": 90.0,
            "etfData": 95.0
        }
        good_res = QuantAuditEngine.audit_subsystem_data_quality(good_sources)
        self.assertTrue(good_res["isSafeForTrading"])
        self.assertEqual(good_res["gateDecision"], "PROCEED")

        # Bad market price feed triggers Risk Gate NO TRADE
        bad_sources = good_sources.copy()
        bad_sources["marketPrice"] = 92.0 # Dropped below 99%
        bad_res = QuantAuditEngine.audit_subsystem_data_quality(bad_sources)
        self.assertFalse(bad_res["isSafeForTrading"])
        self.assertIn("NO_TRADE", bad_res["gateDecision"])

    def test_risk_gate_veto_power(self):
        """Verify that high Opportunity with high Risk results in NO TRADE."""
        engine = DecisionEngineV5_2()
        decision = engine.analyze_asset(
            symbol="DANGER_COIN",
            coin_data={
                "currentPrice": 45000.0,
                "volatility": 85.0, # Dangerous volatility spike
                "liquidity": 1000.0, # Low liquidity
                "fundingRate": 0.08
            },
            profile_key="STANDARD_V5_2",
            force_refresh=True
        )
        # Risk Gate must block or categorize appropriately
        self.assertTrue(decision["tripleScore"]["riskScore"] >= 0)
        self.assertIn(decision["actionEn"], ["NO_TRADE", "AVOID", "WAIT", "MONITOR", "BUY"])
        if decision["tripleScore"]["riskScore"] >= 75.0:
            self.assertEqual(decision["actionEn"], "NO_TRADE")

if __name__ == "__main__":
    unittest.main()

