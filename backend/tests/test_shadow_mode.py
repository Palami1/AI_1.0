import unittest
import time
from app.ai.shadow import ShadowModeEngine, shadow_mode_engine

class TestShadowModeAndVerificationSuite(unittest.TestCase):
    """
    V5.4 Live Shadow Mode & Rigorous Verification Test Suite
    Tests Point-in-Time Universe, First-Hit Touch Resolution, and 9-Criteria Hardened Risk Gate.
    """

    def test_point_in_time_historical_universe(self):
        """Verify that historical universe matches exact point-in-time composition."""
        engine = ShadowModeEngine()
        pit_2024 = engine.evaluate_point_in_time_universe("2024-Q1")
        self.assertTrue(pit_2024["pointInTimeValidated"])
        self.assertIn("LUNA_CLASSIC", pit_2024["assets"])
        self.assertIn("FTT_LEGACY", pit_2024["assets"])

    def test_first_hit_tp_vs_sl_path_dependent_resolution(self):
        """Verify that intra-candle touch resolution accurately identifies TP or SL first."""
        entry = 100.0
        tp = 108.5
        sl = 94.5

        # Candle 1: Sideway, Candle 2: Touches SL first
        candles_sl = [
            {"high": 102.0, "low": 98.0, "close": 101.0, "timestamp": 1},
            {"high": 103.0, "low": 94.0, "close": 95.0, "timestamp": 2} # Low 94.0 <= 94.5 (Hit SL)
        ]
        res_sl = ShadowModeEngine.resolve_first_hit_tp_sl(candles_sl, entry, tp, sl, is_long=True)
        self.assertFalse(res_sl["isWin"])
        self.assertIn("STOP_LOSS", res_sl["hitTarget"])

        # Candle 1: Touches TP first
        candles_tp = [
            {"high": 109.2, "low": 99.0, "close": 108.0, "timestamp": 1} # High 109.2 >= 108.5 (Hit TP)
        ]
        res_tp = ShadowModeEngine.resolve_first_hit_tp_sl(candles_tp, entry, tp, sl, is_long=True)
        self.assertTrue(res_tp["isWin"])
        self.assertEqual(res_tp["hitTarget"], "TAKE_PROFIT")

    def test_hardened_risk_gate_9_criteria_rejections(self):
        """Verify that stale data, high spread, or high risk strictly triggers NO TRADE."""
        # Baseline healthy case -> Allowed
        healthy_gate = ShadowModeEngine.execute_hardened_risk_gate(
            feed_latencies={"marketPrice": 1.2, "orderBook": 1.5, "openInterest": 60.0, "fundingRate": 3600.0},
            data_quality_composite=99.0,
            model_confidence=82.0,
            market_risk_score=30.0,
            agent_conflict_count=1,
            liquidity_depth_usd=2500000.0,
            estimated_execution_cost_pct=0.20,
            spread_pct=0.02,
            is_kill_switch_active=False
        )
        self.assertTrue(healthy_gate["isAllowed"])

        # Stale Price data (>5s) -> Rejection
        stale_gate = ShadowModeEngine.execute_hardened_risk_gate(
            feed_latencies={"marketPrice": 12.0, "orderBook": 1.5},
            data_quality_composite=99.0,
            model_confidence=82.0,
            market_risk_score=30.0,
            agent_conflict_count=1,
            liquidity_depth_usd=2500000.0,
            estimated_execution_cost_pct=0.20,
            spread_pct=0.02
        )
        self.assertFalse(stale_gate["isAllowed"])
        self.assertIn("marketPrice", stale_gate["rejectionReasons"][0])

        # Kill Switch Triggered -> Rejection
        kill_gate = ShadowModeEngine.execute_hardened_risk_gate(
            feed_latencies={"marketPrice": 1.0},
            data_quality_composite=99.0,
            model_confidence=82.0,
            market_risk_score=30.0,
            agent_conflict_count=1,
            liquidity_depth_usd=2500000.0,
            estimated_execution_cost_pct=0.20,
            spread_pct=0.02,
            is_kill_switch_active=True
        )
        self.assertFalse(kill_gate["isAllowed"])
        self.assertIn("KILL_SWITCH", kill_gate["rejectionReasons"][0])

    def test_kill_switch_operational_audit_log(self):
        """Verify kill switch state logging with Who, When, and Why."""
        engine = ShadowModeEngine()
        res = engine.activate_kill_switch(user="RiskOfficer-1", reason="Extreme Binance WebSocket Desync")
        self.assertTrue(res["isActive"])
        self.assertEqual(res["activatedBy"], "RiskOfficer-1")
        self.assertEqual(res["reason"], "Extreme Binance WebSocket Desync")
        
        clear_res = engine.deactivate_kill_switch(user="Admin-1")
        self.assertFalse(clear_res["isActive"])

    def test_shadow_mode_counterfactual_summary(self):
        """Verify calibration curve bins and NO TRADE counterfactual loss prevention analytics."""
        engine = ShadowModeEngine()
        summary = engine.get_shadow_mode_summary()
        self.assertIn("DEMO", summary["dataProvenanceLabel"])
        self.assertEqual(len(summary["calibrationCurveBins"]), 5)
        self.assertEqual(summary["noTradeCounterfactualAnalytics"]["totalBlockedSignals"], 161)
        self.assertGreater(summary["noTradeCounterfactualAnalytics"]["hypotheticalOutcomes"]["lossesPreventedEstimate"], 100)

if __name__ == "__main__":
    unittest.main()
