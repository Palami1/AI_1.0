from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter()

# Historical Market Replay Scenarios for backtesting
REPLAY_SCENARIOS = [
    {
        "id": "rep-1",
        "title": "Bitcoin Breakout $45,000 (ມັງກອນ 2024)",
        "symbol": "BTC/USDT",
        "date": "2024-01-08",
        "startPrice": 44200,
        "historicalContextLao": "ກ່ອນການອະນຸມັດ Bitcoin Spot ETF ຕະຫຼາດມີຄວາມຕຶງຄຽດ ແລະ ມີແຮງຊື້ປາວານສະສົມ",
        "candles": [
            {"time": "09:00", "price": 44200, "action": "WAIT", "score": 68},
            {"time": "12:00", "price": 45100, "action": "BUY (4/6)", "score": 88},
            {"time": "15:00", "price": 46800, "action": "BUY (5/6)", "score": 93},
            {"time": "18:00", "price": 47200, "action": "MONITOR", "score": 82},
            {"time": "21:00", "price": 48500, "action": "TAKE PROFIT", "score": 75}
        ]
    },
    {
        "id": "rep-2",
        "title": "Solana Rally ຈາກ $20 ສູ່ $100 (ຕຸລາ 2023)",
        "symbol": "SOL/USDT",
        "date": "2023-10-16",
        "startPrice": 22.5,
        "historicalContextLao": "ການ Breakout ເສັ້ນ 200 ວັນຮອບໃຫຍ່ ພ້ອມ Volume Spike ຈາກນັກລົງທຶນສະຖາບັນ",
        "candles": [
            {"time": "Day 1", "price": 22.5, "action": "BUY (5/6)", "score": 92},
            {"time": "Day 3", "price": 28.4, "action": "BUY (6/6)", "score": 96},
            {"time": "Day 7", "price": 38.0, "action": "BUY (5/6)", "score": 90},
            {"time": "Day 14", "price": 55.0, "action": "MONITOR", "score": 84},
            {"time": "Day 30", "price": 78.5, "action": "TAKE PROFIT", "score": 72}
        ]
    }
]

@router.get("/scenarios", summary="Get historical replay scenarios")
def get_replay_scenarios():
    return REPLAY_SCENARIOS
