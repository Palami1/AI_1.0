import random
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Query
from datetime import datetime

router = APIRouter()

SCANNER_SIGNALS_DB = [
    {
        "id": "scan-1",
        "symbol": "SOL/USDT",
        "name": "Solana",
        "code": "SOL",
        "signalType": "Breakout (ທະລຸແນວຕ້ານ)",
        "signalLevel": "HIGH",
        "signalColor": "emerald",
        "price": 182.5,
        "change24h": 8.95,
        "volumeRatio": "3.8x (ປົກກະຕິ)",
        "rsi": 68.4,
        "detailLao": "ລາຄາທະລຸແນວຕ້ານ $180 ພ້ອມ Volume ສະໜັບສະໜູນສູງຜິດປົກກະຕິ",
        "action": "ຊື້ (BUY)",
        "confidence": 88,
        "timestamp": "20 ວິນາທີກ່ອນ"
    },
    {
        "id": "scan-2",
        "symbol": "TAO/USDT",
        "name": "Bittensor",
        "code": "TAO",
        "signalType": "Volume Spike (ແຮງຊື້ພຸ່ງ)",
        "signalLevel": "VERY HIGH",
        "signalColor": "purple",
        "price": 535.0,
        "change24h": 14.8,
        "volumeRatio": "5.2x (ພຸ່ງແຮງ)",
        "rsi": 72.1,
        "detailLao": "ປະລິມານ Volume ເພີ່ມຂຶ້ນ 520% ໃນ 15 ນາທີ ພົບສັນຍານ Smart Money ເຂົ້າຊື້",
        "action": "ຊື້ (BUY)",
        "confidence": 92,
        "timestamp": "45 ວິນາທີກ່ອນ"
    },
    {
        "id": "scan-3",
        "symbol": "SUI/USDT",
        "name": "Sui Network",
        "code": "SUI",
        "signalType": "Whale Accumulation (ປາວານຊື້)",
        "signalLevel": "HIGH",
        "signalColor": "blue",
        "price": 1.95,
        "change24h": 6.25,
        "volumeRatio": "2.4x",
        "rsi": 61.5,
        "detailLao": "ພົບກະເປົາປາວານ 3 ລາຍການ ຊື້ສະສົມລວມກວ່າ $12.5M",
        "action": "ຕິດຕາມ (MONITOR)",
        "confidence": 84,
        "timestamp": "1 ນາທີກ່ອນ"
    },
    {
        "id": "scan-4",
        "symbol": "NEAR/USDT",
        "name": "NEAR Protocol",
        "code": "NEAR",
        "signalType": "MACD Golden Cross",
        "signalLevel": "MEDIUM",
        "signalColor": "emerald",
        "price": 6.85,
        "change24h": 7.6,
        "volumeRatio": "2.1x",
        "rsi": 65.0,
        "detailLao": "ເສັ້ນ MACD ຕັດ Signal Line ຂຶ້ນໃນກອບ 4H ເປັນສັນຍານແນວໂນ້ມຂາຂຶ້ນຮອບໃໝ່",
        "action": "ຊື້ (BUY)",
        "confidence": 86,
        "timestamp": "2 ນາທີກ່ອນ"
    },
    {
        "id": "scan-5",
        "symbol": "UNI/USDT",
        "name": "Uniswap",
        "code": "UNI",
        "signalType": "RSI Oversold (ຂາຍຫຼາຍເກີນໄປ)",
        "signalLevel": "HIGH",
        "signalColor": "amber",
        "price": 10.45,
        "change24h": -1.85,
        "volumeRatio": "1.4x",
        "rsi": 28.5,
        "detailLao": "RSI ຫຼຸດຕ່ຳກວ່າ 30 ເຂົ້າສູ່ເຂດ Oversold ພ້ອມແນວຮັບແຂງແກ່ນ $10.20",
        "action": "ຕິດຕາມ (MONITOR)",
        "confidence": 79,
        "timestamp": "3 ນາທີກ່ອນ"
    },
    {
        "id": "scan-6",
        "symbol": "PEPE/USDT",
        "name": "Pepe",
        "code": "PEPE",
        "signalType": "Resistance Rejection (ຕິດແນວຕ້ານ)",
        "signalLevel": "MEDIUM",
        "signalColor": "rose",
        "price": 0.0000114,
        "change24h": -3.4,
        "volumeRatio": "1.1x",
        "rsi": 54.0,
        "detailLao": "ລາຄາບໍ່ຜ່ານແນວຕ້ານໃຫຍ່ ເລີ່ມເກີດແຮງເທຂາຍໄລຍະສັ້ນ",
        "action": "ລໍຖ້າ (WAIT)",
        "confidence": 68,
        "timestamp": "5 ນາທີກ່ອນ"
    }
]

@router.get("/signals", summary="Get 24/7 Smart Scanner signals")
def get_scanner_signals(
    signal_type: Optional[str] = Query(default=None, description="Filter by signal (Breakout, Volume Spike, Whale, RSI, MACD)"),
    min_confidence: int = Query(default=0, ge=0, le=100)
):
    results = SCANNER_SIGNALS_DB
    if signal_type and signal_type.lower() != "all" and signal_type.lower() != "ທັງໝົດ":
        results = [s for s in results if signal_type.lower() in s["signalType"].lower()]
    
    results = [s for s in results if s["confidence"] >= min_confidence]
    return {
        "scanInterval": "30s Real-time",
        "totalCoinsScanned": 524,
        "activeSignalsCount": len(results),
        "signals": results,
        "lastScanTime": datetime.utcnow().strftime("%H:%M:%S UTC")
    }
