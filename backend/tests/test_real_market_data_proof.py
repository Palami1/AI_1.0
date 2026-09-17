import unittest
import time
from app.ai.provenance import RealDataProvenanceEngine

class TestRealMarketDataProof(unittest.TestCase):
    """
    V5.3 Real Market Data Proof Test Suite
    Verifies raw Brier calculation, Precision confusion matrix, survivorship bias,
    and individual feature-level lookahead audits.
    """

    def test_raw_brier_score_calculation(self):
        """Verify that Brier score is computed from raw probabilities and binary outcomes."""
        # 100 sample prediction evaluations
        predictions = []
        for i in range(100):
            # Calibrated model: High confidence (0.80) wins 80% of the time
            prob = 0.78 if i < 70 else 0.45
            outcome = True if (i < 55 or (i >= 70 and i < 80)) else False
            predictions.append({
                "predictedProbability": prob,
                "outcomeAchieved": outcome
            })
            
        brier_res = RealDataProvenanceEngine.calculate_raw_brier_score(predictions)
        self.assertIn(brier_res["status"], ["WELL_CALIBRATED", "ACCEPTABLE"])
        self.assertLess(brier_res["brierScore"], 0.20)
        self.assertEqual(brier_res["sampleSize"], 100)

    def test_raw_precision_confusion_matrix(self):
        """Verify TP, FP, TN, FN computation and precision = TP / (TP + FP)."""
        evaluations = [
            {"signal": "BUY", "outcomeAchieved": True},   # TP
            {"signal": "BUY", "outcomeAchieved": True},   # TP
            {"signal": "BUY", "outcomeAchieved": False},  # FP
            {"signal": "NO_TRADE", "outcomeAchieved": False}, # TN (Correct filter)
            {"signal": "NO_TRADE", "outcomeAchieved": True},  # FN
        ]
        metrics = RealDataProvenanceEngine.calculate_raw_precision_metrics(evaluations)
        self.assertEqual(metrics["confusionMatrix"]["truePositives_TP"], 2)
        self.assertEqual(metrics["confusionMatrix"]["falsePositives_FP"], 1)
        self.assertEqual(metrics["confusionMatrix"]["trueNegatives_TN"], 1)
        self.assertEqual(metrics["confusionMatrix"]["falseNegatives_FN"], 1)
        # Precision = 2 / (2 + 1) = 66.7%
        self.assertAlmostEqual(metrics["precision"], 66.7, places=1)

    def test_survivorship_bias_audit(self):
        """Verify that dataset universe contains delisted & collapsed assets."""
        universe = [
            {"symbol": "BTC/USDT", "isDelisted": False},
            {"symbol": "ETH/USDT", "isDelisted": False},
            {"symbol": "SOL/USDT", "isDelisted": False},
            {"symbol": "LUNA/USDT", "isDelisted": True, "status": "DEAD"},
            {"symbol": "FTT/USDT", "isDelisted": True, "status": "DEAD"},
            {"symbol": "UST/USDT", "isDelisted": True, "status": "DEAD"},
            {"symbol": "BNB/USDT", "isDelisted": False},
            {"symbol": "XRP/USDT", "isDelisted": False},
            {"symbol": "ADA/USDT", "isDelisted": False},
            {"symbol": "AVAX/USDT", "isDelisted": False},
        ]
        audit = RealDataProvenanceEngine.audit_survivorship_bias(universe)
        self.assertEqual(audit["status"], "PASS")
        self.assertEqual(audit["delistedOrDeadAssetsTested"], 3)
        self.assertEqual(audit["delistedRatio"], "30.0%")

    def test_feature_level_lookahead_audit(self):
        """Verify that any individual indicator using future candles is caught and failed."""
        now = int(time.time())
        clean_features = [
            {"featureName": "RSI_14", "dataCutoffTimestamp": now - 60},
            {"featureName": "MACD_12_26_9", "dataCutoffTimestamp": now - 60},
            {"featureName": "WhaleFlowNet", "dataCutoffTimestamp": now - 120},
            {"featureName": "FundingRateRealtime", "dataCutoffTimestamp": now - 10},
            {"featureName": "OpenInterestAgg", "dataCutoffTimestamp": now - 30}
        ]
        pass_res = RealDataProvenanceEngine.audit_feature_level_lookahead(clean_features, evaluation_timestamp=now)
        self.assertEqual(pass_res["status"], "PASS")
        self.assertEqual(pass_res["violationsCount"], 0)

        # Inject feature lookahead leakage in MACD
        leaked_features = clean_features.copy()
        leaked_features.append({"featureName": "MACD_Future_Leak", "dataCutoffTimestamp": now + 300})
        fail_res = RealDataProvenanceEngine.audit_feature_level_lookahead(leaked_features, evaluation_timestamp=now)
        self.assertEqual(fail_res["status"], "FAIL")
        self.assertEqual(fail_res["violationsCount"], 1)

    def test_traceable_prediction_log_provenance(self):
        """Verify complete trace from Feature Snapshot -> Model -> Signal -> Execution Costs -> Net Outcome."""
        now = int(time.time())
        log = RealDataProvenanceEngine.build_traceable_prediction_log(
            pred_id="LOG-PROV-2026-001",
            symbol="BTC/USDT",
            timeframe="1H",
            timestamp_t=now,
            feature_snapshot={"rsi": 34.2, "oi_delta": "+8.4%", "whale_net": "$14.2M"},
            model_version="v5.3.0-quant-proof",
            triple_score={"opportunity": 88, "confidence": 82, "risk": 34},
            decision="BUY",
            entry_price=68400.0,
            exit_price=72100.0,
            execution_costs={"makerFee": 0.04, "takerFee": 0.08, "spread": 0.02, "slippage": 0.05, "marketImpact": 0.01}
        )
        self.assertEqual(log["predictionId"], "LOG-PROV-2026-001")
        self.assertEqual(log["execution"]["costBreakdown"]["totalRoundtripCostPct"], 0.20)
        self.assertGreater(log["execution"]["netPnlPct"], 0)
        self.assertEqual(log["outcome"]["status"], "WIN")

if __name__ == "__main__":
    unittest.main()
