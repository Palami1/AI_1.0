from fastapi import APIRouter, HTTPException, Query
from app.ai.engine import decision_engine_v3
from app.services.crypto_service import crypto_service

router = APIRouter()

@router.post("/analyze/{symbol}", summary="Trigger full Multi-Agent AI Analysis for a coin")
def analyze_coin(symbol: str):
    # Fetch coin data
    coin = crypto_service.get_coin_detail(symbol)
    if not coin or "error" in coin:
        # Fallback to general object
        coin = {
            "symbol": symbol.upper(),
            "currentPrice": 65000.0,
            "change24h": 4.5,
            "volume24h": 32000000000,
            "indicators": {"rsi14": 62.4}
        }
    
    result = decision_engine_v3.analyze_asset(symbol.upper(), coin)
    return result

@router.get("/alerts", summary="Get real-time actionable AI alerts")
def get_ai_alerts():
    overview = crypto_service.get_market_overview()
    return overview.get("aiAlerts", [])
