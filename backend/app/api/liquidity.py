from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter()

@router.get("/heatmap/{symbol}", summary="Get CoinGlass-style Liquidity and Liquidation Clusters")
def get_liquidity_heatmap(symbol: str = "BTC"):
    sym = symbol.upper().replace("/USDT", "").replace("/", "")
    
    if sym == "BTC":
        current_price = 66850.0
        clusters = [
            {"level": 69200, "type": "SHORT_LIQUIDATION", "volumeUsd": "$385M", "density": "VERY_HIGH", "labelLao": "Short Squeeze Zone (Shorts ຖືກລ້າງພອດ $385M)"},
            {"level": 68400, "type": "SHORT_LIQUIDATION", "volumeUsd": "$210M", "density": "HIGH", "labelLao": "Minor Resistance Cluster ($210M)"},
            {"level": 66850, "type": "CURRENT_PRICE", "volumeUsd": "$0M", "density": "CURRENT", "labelLao": "ລາຄາປັດຈຸບັນ ($66,850)"},
            {"level": 64800, "type": "LONG_LIQUIDATION", "volumeUsd": "$295M", "density": "HIGH", "labelLao": "Long Liquidation Cluster ($295M)"},
            {"level": 63200, "type": "LONG_LIQUIDATION", "volumeUsd": "$450M", "density": "EXTREME", "labelLao": "Major Stop Hunt Level (Longs ຖືກລ້າງພອດ $450M)"},
        ]
    elif sym == "SOL":
        current_price = 182.5
        clusters = [
            {"level": 195.0, "type": "SHORT_LIQUIDATION", "volumeUsd": "$64M", "density": "HIGH", "labelLao": "Short Squeeze Target ($64M)"},
            {"level": 182.5, "type": "CURRENT_PRICE", "volumeUsd": "$0M", "density": "CURRENT", "labelLao": "ລາຄາປັດຈຸບັນ ($182.5)"},
            {"level": 172.0, "type": "LONG_LIQUIDATION", "volumeUsd": "$85M", "density": "HIGH", "labelLao": "Long Support Liquidation ($85M)"},
        ]
    else:
        current_price = 3480.0
        clusters = [
            {"level": 3650.0, "type": "SHORT_LIQUIDATION", "volumeUsd": "$180M", "density": "HIGH", "labelLao": "Short Liquidation Zone ($180M)"},
            {"level": 3480.0, "type": "CURRENT_PRICE", "volumeUsd": "$0M", "density": "CURRENT", "labelLao": "ລາຄາປັດຈຸບັນ ($3,480)"},
            {"level": 3320.0, "type": "LONG_LIQUIDATION", "volumeUsd": "$220M", "density": "HIGH", "labelLao": "Long Liquidation Target ($220M)"},
        ]

    return {
        "symbol": f"{sym}/USDT",
        "currentPrice": current_price,
        "clusters": clusters,
        "summaryLao": f"ສະພາບຄ່ອງຝັ່ງ Short ຢູ່ດ້ານເທິງມີຄວາມໜາແໜ້ນກວ່າ ຕະຫຼາດມີໂອກາດເກີດ Short Squeeze ແລ່ນຂຶ້ນໄປດູດ Liquidity.",
        "stopHuntWarning": "ລະວັງການທຸບລົງໄປແຕະແນວຮັບເພື່ອ Stop Hunt ກ່ອນທີ່ຈະດີດຕົວກັບຂຶ້ນແຮງ."
    }
