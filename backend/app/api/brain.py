from fastapi import APIRouter
from typing import Dict, Any, List
from datetime import datetime

router = APIRouter()

@router.get("/metrics", summary="Get Global Market Brain institutional overview")
def get_market_brain():
    return {
        "timestamp": datetime.utcnow().strftime("%H:%M:%S UTC"),
        "syncStatus": "Real-time WebSocket Synchronized",
        "marketMatrix": {
            "totalCryptoMarketCap": "$2.38T",
            "btcDominance": 55.4,
            "ethDominance": 17.2,
            "usdtDominance": 4.8,
            "fearAndGreed": {
                "score": 74,
                "status": "ໂລບມາກ (Greed)",
                "sentiment": "BULLISH"
            }
        },
        "derivativesMatrix": {
            "btcOpenInterest": "$34.8B (+4.2%)",
            "ethOpenInterest": "$14.2B (+2.8%)",
            "weightedFundingRate": "0.0112% (ປົກກະຕິ)",
            "longShortRatio": "52.4% Longs / 47.6% Shorts",
            "total24hLiquidations": "$148.5M ($92M Shorts / $56.5M Longs)"
        },
        "institutionalFlows": {
            "spotEtfNetFlow24h": "+$382.4M",
            "stablecoinMintNet24h": "+$420.0M",
            "exchangeNetOutflow": "-$245.8M",
            "smartScore": 88
        },
        "macroCatalysts": [
            {"title": "BlackRock Spot Bitcoin ETF ຖືຄອງທະລຸ 350,000 BTC", "impact": "POSITIVE", "time": "15 ນາທີກ່ອນ"},
            {"title": "Fed ສົ່ງສັນຍານຄົງອັດຕາດອກເບ້ຍ ແລະ ມີແຜນຫຼຸດດອກເບ້ຍໃນໄຕຣມາດ 3", "impact": "POSITIVE", "time": "1 ຊົ່ວໂມງກ່ອນ"},
            {"title": "Open Interest ສັນຍາອະນຸພັນແຕະລະດັບສູງສຸດໃນຮອບ 6 ເດືອນ", "impact": "VOLATILITY", "time": "3 ຊົ່ວໂມງກ່ອນ"}
        ]
    }
