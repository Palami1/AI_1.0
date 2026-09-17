"""
Shadow Forward Automation Script for GitHub Actions / Scheduled Execution.
Fetches live market candles directly via Binance REST API (No CCXT dependency required),
evaluates 10-Agent Consensus & Hardened Risk Gate, and commits immutable SHA-256 records.
"""
import os
import sys
import json
import time
import uuid
import urllib.request
from datetime import datetime, timezone

# Ensure project backend is in path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.ai.ledger import persistent_shadow_ledger
from app.ai.engine import decision_engine_v3

SYMBOLS = [
    ("BTC/USDT", "BTCUSDT"),
    ("ETH/USDT", "ETHUSDT"),
    ("SOL/USDT", "SOLUSDT"),
    ("BNB/USDT", "BNBUSDT"),
    ("XRP/USDT", "XRPUSDT")
]

def fetch_binance_ticker(symbol_raw: str):
    url = f"https://api.binance.com/api/v3/ticker/24hr?symbol={symbol_raw}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_forward_scan():
    print(f"[{datetime.now(timezone.utc).isoformat()}] Starting Autonomous Shadow Forward Ingestion...")
    collected = 0

    for display_symbol, raw_symbol in SYMBOLS:
        try:
            print(f"Fetching real market ticker for {display_symbol} ({raw_symbol})...")
            ticker = fetch_binance_ticker(raw_symbol)
            
            current_price = float(ticker.get("lastPrice", 0.0))
            change_24h = float(ticker.get("priceChangePercent", 0.0))
            volume_24h = float(ticker.get("quoteVolume", 1000000.0))
            high_24h = float(ticker.get("highPrice", current_price))
            low_24h = float(ticker.get("lowPrice", current_price))

            coin_data = {
                "symbol": display_symbol,
                "price": current_price,
                "change24h": change_24h,
                "volume24h": volume_24h,
                "marketCap": volume_24h * 15
            }

            # Run 10-Agent Consensus Engine
            consensus_result = decision_engine_v3.analyze_asset(symbol=display_symbol, coin_data=coin_data)
            action = consensus_result.get("action", "NO_TRADE")
            confidence = float(consensus_result.get("confidence", 50.0))
            opportunity = float(consensus_result.get("opportunityScore", 50.0))
            risk = float(consensus_result.get("riskScore", 50.0))

            tp = round(current_price * 1.03, 4) if "BUY" in action else round(current_price * 0.97, 4)
            sl = round(current_price * 0.97, 4) if "BUY" in action else round(current_price * 1.03, 4)

            pred_id = f"fwd-{display_symbol.replace('/', '').lower()}-{int(time.time())}-{uuid.uuid4().hex[:6]}"

            record = {
                "predictionId": pred_id,
                "timestampUtc": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
                "timestampUnix": int(time.time()),
                "symbol": display_symbol,
                "modelVersion": "V5.4.2",
                "featuresVersion": "F5.4.2",
                "riskVersion": "RG5.4.2",
                "thresholdVersion": "T5.4.2",
                "confidence": confidence,
                "opportunity": opportunity,
                "risk": risk,
                "action": str(action),
                "entryPrice": current_price,
                "takeProfit": tp,
                "stopLoss": sl,
                "featureSnapshot": {
                    "price": current_price,
                    "change24h": change_24h,
                    "volume24h": volume_24h,
                    "high24h": high_24h,
                    "low24h": low_24h,
                    "source": "Binance Public REST Live Feed"
                }
            }

            sha256_hash = persistent_shadow_ledger.insert_prediction(record)

            # Clean ASCII status log
            safe_action = "BUY" if "BUY" in str(action) else ("SELL" if "SELL" in str(action) else "NO_TRADE")
            print(f"[OK] Recorded Forward Signal [{pred_id}]: {display_symbol} @ ${current_price:,.2f} -> {safe_action} (Conf {confidence}%) [SHA-256: {sha256_hash[:12]}...]")
            collected += 1

        except Exception as e:
            print(f"Error processing {display_symbol}: {e}")

    print(f"Shadow Ingestion Completed: Successfully recorded {collected} signals.")

if __name__ == "__main__":
    run_forward_scan()
