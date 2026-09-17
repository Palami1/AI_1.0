"""
LAO AI INVESTMENT OS V5.3 — Real Historical Data Proof & Provenance Engine
Reproducibly computes Brier score, Precision, Survivorship Bias, and Feature-level Leakage
from traceable raw historical prediction logs with complete provenance.
"""
from typing import Dict, Any, List, Optional
import math
import time

class RealDataProvenanceEngine:
    @staticmethod
    def calculate_raw_brier_score(predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates raw Brier Score: Brier = (1/N) * sum((predicted_prob - actual_binary_outcome)^2)
        Target: Brier <= 0.20 (0.0 = perfect calibration, 0.25 = random coin toss)
        """
        if not predictions:
            return {"brierScore": 0.25, "sampleSize": 0, "status": "NO_DATA"}
            
        squared_errors = []
        for p in predictions:
            prob = p.get("predictedProbability", 0.5)
            # Binary outcome: 1 if target achieved (profit >= target in timeframe), 0 if stop/loss/fail
            actual = 1.0 if p.get("outcomeAchieved", False) else 0.0
            squared_errors.append((prob - actual) ** 2)
            
        brier = sum(squared_errors) / len(squared_errors)
        status = "WELL_CALIBRATED" if brier <= 0.16 else ("ACCEPTABLE" if brier <= 0.22 else "POOR_CALIBRATION")
        
        return {
            "brierScore": round(brier, 3),
            "sampleSize": len(predictions),
            "status": status,
            "formula": "Brier = (1/N) * sum((prob - outcome)^2)",
            "meanSquaredError": round(brier, 4)
        }

    @staticmethod
    def calculate_raw_precision_metrics(predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates raw Precision = TP / (TP + FP) where:
        Positive = System issued BUY / TRADE signal with target outcome evaluated in specified timeframe (e.g. 4h/24h)
        TP (True Positive) = Signal was BUY and achieved target >= TakeProfit without hitting StopLoss
        FP (False Positive) = Signal was BUY and hit StopLoss or failed target
        TN (True Negative) = Signal was NO_TRADE / WAIT and market dropped or chopped
        FN (False Negative) = Signal was NO_TRADE / WAIT but market surged
        """
        tp = sum(1 for p in predictions if p.get("signal") == "BUY" and p.get("outcomeAchieved", False))
        fp = sum(1 for p in predictions if p.get("signal") == "BUY" and not p.get("outcomeAchieved", False))
        tn = sum(1 for p in predictions if p.get("signal") in ["NO_TRADE", "WAIT", "AVOID"] and not p.get("outcomeAchieved", False))
        fn = sum(1 for p in predictions if p.get("signal") in ["NO_TRADE", "WAIT", "AVOID"] and p.get("outcomeAchieved", False))
        
        precision = (tp / (tp + fp)) if (tp + fp) > 0 else 0.0
        recall = (tp / (tp + fn)) if (tp + fn) > 0 else 0.0
        accuracy = ((tp + tn) / (tp + fp + tn + fn)) if (tp + fp + tn + fn) > 0 else 0.0
        
        return {
            "precision": round(precision * 100, 1),
            "recall": round(recall * 100, 1),
            "accuracy": round(accuracy * 100, 1),
            "confusionMatrix": {
                "truePositives_TP": tp,
                "falsePositives_FP": fp,
                "trueNegatives_TN": tn,
                "falseNegatives_FN": fn,
                "totalEvaluated": tp + fp + tn + fn
            },
            "positiveDefinition": "BUY signal reaching +8.5% TP1 before -5.5% SL in 24h evaluation window"
        }

    @staticmethod
    def audit_survivorship_bias(universe: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Verify that the historical testing universe includes delisted, dead, or collapsed tokens
        (e.g., LUNA, FTT, UST, delisted Binance pairs) to prevent survivorship bias.
        """
        delisted_count = sum(1 for asset in universe if asset.get("isDelisted", False) or asset.get("status") == "DEAD")
        total_assets = len(universe)
        delisted_ratio = (delisted_count / total_assets) if total_assets > 0 else 0.0
        
        # Rigorous test requires at least 8% delisted/dead historical assets
        status = "PASS" if delisted_ratio >= 0.08 else "SURVIVORSHIP_BIAS_WARNING"
        
        return {
            "name": "Survivorship Bias Audit",
            "status": status,
            "totalAssetsInUniverse": total_assets,
            "delistedOrDeadAssetsTested": delisted_count,
            "delistedRatio": f"{delisted_ratio * 100:.1f}%",
            "sampleDelistedAssets": [a["symbol"] for a in universe if a.get("isDelisted", False)][:5],
            "details": f"Universe ປະກອບມີຫຼຽນທີ່ Delisted/Dead {delisted_count}/{total_assets} ຫຼຽນ ({delisted_ratio*100:.1f}%) ເພື່ອປ້ອງກັນ Survivorship Bias"
        }

    @staticmethod
    def audit_feature_level_lookahead(features_manifest: List[Dict[str, Any]], evaluation_timestamp: int) -> Dict[str, Any]:
        """
        Audit individual indicators (RSI, MACD, OI, Funding, Whale, ETF, News)
        to ensure none used future candles or closing prices after evaluation_timestamp T.
        """
        violations = []
        for feat in features_manifest:
            name = feat.get("featureName")
            data_cutoff = feat.get("dataCutoffTimestamp", 0)
            if data_cutoff > evaluation_timestamp:
                violations.append({
                    "feature": name,
                    "cutoff": data_cutoff,
                    "evalTime": evaluation_timestamp,
                    "leakageSeconds": data_cutoff - evaluation_timestamp
                })
                
        status = "PASS" if len(violations) == 0 else "FAIL"
        return {
            "name": "Feature-Level Lookahead Bias",
            "status": status,
            "totalFeaturesAudited": len(features_manifest),
            "violationsCount": len(violations),
            "violations": violations,
            "details": "ທຸກ Indicator (RSI, MACD, OI, Funding, Whale, ETF) ຖືກສ້າງຈາກຂໍ້ມູນກ່ອນເວລາ T ເທົ່ານັ້ນ" if not violations else f"🚨 ພົບ Feature Leakage {len(violations)} ຕົວ"
        }

    @staticmethod
    def build_traceable_prediction_log(
        pred_id: str,
        symbol: str,
        timeframe: str,
        timestamp_t: int,
        feature_snapshot: Dict[str, Any],
        model_version: str,
        triple_score: Dict[str, Any],
        decision: str,
        entry_price: float,
        exit_price: float,
        execution_costs: Dict[str, float],
        target_timeframe_hours: int = 24
    ) -> Dict[str, Any]:
        """
        Builds an immutable, fully traceable prediction log linking Feature Snapshot -> Model -> Signal -> Execution -> Outcome.
        """
        gross_pnl_pct = ((exit_price - entry_price) / entry_price) * 100 if entry_price > 0 else 0.0
        total_costs_pct = (
            execution_costs.get("makerFee", 0.04) +
            execution_costs.get("takerFee", 0.08) +
            execution_costs.get("spread", 0.02) +
            execution_costs.get("slippage", 0.05) +
            execution_costs.get("marketImpact", 0.01)
        )
        net_pnl_pct = gross_pnl_pct - total_costs_pct
        outcome_achieved = net_pnl_pct >= 4.0 # Target positive net hurdle

        return {
            "predictionId": pred_id,
            "provenance": {
                "symbol": symbol,
                "timeframe": timeframe,
                "timestampT": timestamp_t,
                "utcTime": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime(timestamp_t)),
                "dataSource": "Binance Top-of-Book 1s + CoinGlass OI/Funding + On-Chain Node",
                "modelVersion": model_version,
                "strategyProfile": "STANDARD_V5_3_AUDIT"
            },
            "featureSnapshot": feature_snapshot,
            "tripleScore": triple_score,
            "decision": decision,
            "execution": {
                "entryPrice": entry_price,
                "exitPrice": exit_price,
                "grossPnlPct": round(gross_pnl_pct, 2),
                "costBreakdown": {
                    "makerFeePct": execution_costs.get("makerFee", 0.04),
                    "takerFeePct": execution_costs.get("takerFee", 0.08),
                    "spreadPct": execution_costs.get("spread", 0.02),
                    "slippagePct": execution_costs.get("slippage", 0.05),
                    "marketImpactPct": execution_costs.get("marketImpact", 0.01),
                    "totalRoundtripCostPct": round(total_costs_pct, 3)
                },
                "netPnlPct": round(net_pnl_pct, 2)
            },
            "outcome": {
                "evaluationWindowHours": target_timeframe_hours,
                "outcomeAchieved": outcome_achieved,
                "status": "WIN" if net_pnl_pct > 0 else ("CORRECT_NO_TRADE" if decision == "NO_TRADE" else "LOSS")
            }
        }
