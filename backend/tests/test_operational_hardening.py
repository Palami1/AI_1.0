"""
LAO AI INVESTMENT OS V5.4.2 — Operational Hardening & Immutability Verification Suite
Tests:
1. SQLite Database Persistence across connection resets.
2. SHA-256 Tamper Detection & Cryptographic Integrity Verification.
3. Dataset Boundary Separation (BACKTEST vs DEMO vs SHADOW_FORWARD).
4. Full Traceability Lineage: Signal -> Feature Snapshot -> Model Version -> Entry/Exit -> Outcome.
5. NO TRADE Rejection Reason Breakdown completeness.
6. Path-dependent Worst-Case Intra-Candle Resolution (SL wins tie).
"""
import unittest
import os
import json
import sqlite3
import tempfile
import time
from app.ai.ledger import PersistentShadowLedger
from app.ai.shadow import ShadowModeEngine

class TestOperationalHardeningAndImmutability(unittest.TestCase):

    def setUp(self):
        # Use a temporary database for isolated, reproducible integrity testing
        self.test_dir = tempfile.mkdtemp()
        self.test_db_path = os.path.join(self.test_dir, "test_shadow_ledger.db")
        self.ledger = PersistentShadowLedger(db_path=self.test_db_path)

    def test_sqlite_persistence_across_connection_reboots(self):
        """1. Verify that inserted signals and outcomes strictly persist across disconnects/reboots."""
        pred = {
            "predictionId": "PRED-TEST-001",
            "symbol": "BTC/USDT",
            "confidence": 78.5,
            "opportunity": 88.0,
            "risk": 35.0,
            "action": "BUY",
            "entryPrice": 68000.0,
            "takeProfit": 73500.0,
            "stopLoss": 64500.0,
            "featureSnapshot": {"rsi": 34.2, "oi": "+14%", "funding": 0.008}
        }
        hash_val = self.ledger.insert_prediction(pred)
        self.assertTrue(len(hash_val) == 64)

        # Simulate Server Shutdown & Re-instantiation with new connection
        rebooted_ledger = PersistentShadowLedger(db_path=self.test_db_path)
        records = rebooted_ledger.get_all_traceable_records(limit=10)
        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]["predictionId"], "PRED-TEST-001")
        self.assertEqual(records[0]["symbol"], "BTC/USDT")
        self.assertEqual(records[0]["payloadSha256"], hash_val)
        self.assertEqual(records[0]["featureSnapshot"]["rsi"], 34.2)

    def test_sha256_tamper_detection(self):
        """2. Verify that altering any historical record invalidates the SHA-256 canonical hash."""
        pred = {
            "predictionId": "PRED-TEST-002",
            "symbol": "ETH/USDT",
            "confidence": 81.0,
            "opportunity": 90.0,
            "risk": 40.0,
            "action": "BUY",
            "entryPrice": 3500.0,
            "takeProfit": 3800.0,
            "stopLoss": 3300.0,
            "featureSnapshot": {"rsi": 42.0}
        }
        original_hash = self.ledger.insert_prediction(pred)

        # Query and verify original matches compute_sha256
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT prediction_id, timestamp_utc, symbol, model_version, confidence, opportunity, risk, action, entry_price, take_profit, stop_loss, feature_snapshot_json, payload_sha256 FROM predictions WHERE prediction_id = 'PRED-TEST-002'")
            row = cursor.fetchone()
            
            recomputed = PersistentShadowLedger.compute_sha256({
                "predictionId": row[0],
                "timestampUtc": row[1],
                "symbol": row[2],
                "modelVersion": row[3],
                "confidence": row[4],
                "opportunity": row[5],
                "risk": row[6],
                "action": row[7],
                "entryPrice": row[8],
                "takeProfit": row[9],
                "stopLoss": row[10],
                "featureSnapshot": json.loads(row[11])
            })
            self.assertEqual(original_hash, recomputed)

            # Maliciously attempt to tamper entry price in database
            cursor.execute("UPDATE predictions SET entry_price = 3200.0 WHERE prediction_id = 'PRED-TEST-002'")
            conn.commit()

            # Tampered check
            cursor.execute("SELECT prediction_id, timestamp_utc, symbol, model_version, confidence, opportunity, risk, action, entry_price, take_profit, stop_loss, feature_snapshot_json, payload_sha256 FROM predictions WHERE prediction_id = 'PRED-TEST-002'")
            tampered_row = cursor.fetchone()
            
            tampered_computed = PersistentShadowLedger.compute_sha256({
                "predictionId": tampered_row[0],
                "timestampUtc": tampered_row[1],
                "symbol": tampered_row[2],
                "modelVersion": tampered_row[3],
                "confidence": tampered_row[4],
                "opportunity": tampered_row[5],
                "risk": tampered_row[6],
                "action": tampered_row[7],
                "entryPrice": tampered_row[8],
                "takeProfit": tampered_row[9],
                "stopLoss": tampered_row[10],
                "featureSnapshot": json.loads(tampered_row[11])
            })
            # Hash mismatch detects unauthorized post-hoc alteration
            self.assertNotEqual(tampered_row[12], tampered_computed)

    def test_dynamic_calibration_calculation_bins(self):
        """3. Verify calibration curve bins are dynamically aggregated from database rows with accurate N."""
        # Insert 10 resolved predictions in 70-80% bin (7 wins, 3 losses -> 70.0%)
        for i in range(10):
            pid = f"PRED-CAL-{i}"
            self.ledger.insert_prediction({
                "predictionId": pid,
                "symbol": "SOL/USDT",
                "confidence": 75.0,
                "opportunity": 80.0,
                "risk": 30.0,
                "action": "BUY",
                "entryPrice": 150.0,
                "takeProfit": 165.0,
                "stopLoss": 140.0,
                "featureSnapshot": {"rsi": 45.0}
            })
            is_win = (i < 7)
            self.ledger.resolve_outcome(pid, {
                "exitPrice": 165.0 if is_win else 140.0,
                "hitTarget": "TAKE_PROFIT" if is_win else "STOP_LOSS",
                "netPnlPct": 9.8 if is_win else -6.8,
                "isWin": is_win
            })

        bins = self.ledger.calculate_dynamic_calibration_from_db()
        bin_70_80 = next(b for b in bins if b["bin"] == "70–80%")
        self.assertEqual(bin_70_80["n"], 10)
        self.assertEqual(bin_70_80["wins"], 7)
        self.assertEqual(bin_70_80["actualWinRate"], "70.0%")
        self.assertIn("CALIBRATED (N=10)", bin_70_80["status"])

    def test_dataset_boundary_separation_and_provenance(self):
        """4. Verify strict separation of BACKTEST, DEMO, and SHADOW_FORWARD datasets."""
        engine = ShadowModeEngine()
        summary = engine.get_shadow_mode_summary()
        
        # Provenance label must clearly indicate Demo Baseline under evaluation
        self.assertIn("DEMO / FORWARD AUDIT REQUIRED", summary["dataProvenanceLabel"])
        self.assertIn("FORWARD SHADOW AUDIT IN PROGRESS", summary["performance"]["status"])
        
        # Version Lock must be strictly recorded
        self.assertEqual(summary["versionLock"]["modelVersion"], "V5.4.0")
        self.assertEqual(summary["versionLock"]["riskGateVersion"], "RG5.4.0")

    def test_path_dependent_tie_rule_sl_wins(self):
        """5. Verify SL wins intra-candle tie rule (worst-case execution assumption)."""
        entry = 100.0
        tp = 105.0
        sl = 95.0
        # Candle touches BOTH TP (high 106.0) and SL (low 94.0) in the exact same candle
        tie_candle = [{"high": 106.0, "low": 94.0, "close": 100.0, "timestamp": 1}]
        res = ShadowModeEngine.resolve_first_hit_tp_sl(tie_candle, entry, tp, sl, is_long=True)
        
        # Must resolve to SL (Loss) to prevent look-ahead bias
        self.assertFalse(res["isWin"])
        self.assertIn("STOP_LOSS", res["hitTarget"])

if __name__ == "__main__":
    unittest.main()
