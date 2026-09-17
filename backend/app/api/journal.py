from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter()

class JournalEntryCreate(BaseModel):
    symbol: str
    action: str # BUY, SELL
    entryPrice: float
    exitPrice: Optional[float] = None
    reasonLao: str
    result: Optional[str] = None # WIN, LOSS, OPEN
    pnlUsd: Optional[float] = None

JOURNAL_ENTRIES = [
    {
        "id": "j-1",
        "date": "2026-03-16",
        "symbol": "BTC/USDT",
        "action": "BUY",
        "entryPrice": 64200,
        "exitPrice": 66850,
        "pnlUsd": 1325.0,
        "pnlPercent": 4.12,
        "result": "WIN",
        "reasonLao": "ເຂົ້າຕາມສັນຍານ Breakout 4H ພ້ອມ ETF Inflow +$382M",
        "aiSelfReflectionLao": "✅ AI ວິເຄາະຖືກຕ້ອງ: ປັດໄຈ Macro ແລະ On-chain ສະໜັບສະໜູນແຮງຊື້ຊັດເຈນ. ການຕັ້ງ Stop Loss ໃຕ້ EMA50 ເຮັດໃຫ້ບໍ່ຖືກ Stop Hunt."
    },
    {
        "id": "j-2",
        "date": "2026-03-14",
        "symbol": "PEPE/USDT",
        "action": "BUY",
        "entryPrice": 0.0000118,
        "exitPrice": 0.0000114,
        "pnlUsd": -120.0,
        "pnlPercent": -3.38,
        "result": "LOSS",
        "reasonLao": "ເຂົ້າຊື້ຕາມແຮງໂມເມນຕຳໄລຍະສັ້ນ",
        "aiSelfReflectionLao": "❌ AI ວິເຄາະຜິດພາດ: ມອງຂ້າມສັນຍານ Funding Rate ທີ່ສູງເກີນໄປ (Overleveraged) ເຮັດໃຫ້ເກີດ Long Liquidation Flush. ບົດຮຽນ: ໃນຫຼຽນ Meme ຕ້ອງໃຫ້ນ້ຳໜັກ Liquidity & Funding Agent ສູງຂຶ້ນ."
    },
    {
        "id": "j-3",
        "date": "2026-03-12",
        "symbol": "SOL/USDT",
        "action": "BUY",
        "entryPrice": 168.0,
        "exitPrice": 182.5,
        "pnlUsd": 725.0,
        "pnlPercent": 8.63,
        "result": "WIN",
        "reasonLao": "ເຂົ້າຕາມສັນຍານ Whale Accumulation ແລະ RSI Oversold Bounce",
        "aiSelfReflectionLao": "✅ AI ວິເຄາະຖືກຕ້ອງ: ການເຂົ້າຊື້ຈຸດ Pullback ທີ່ເສັ້ນ EMA20 ໃຫ້ Risk-to-Reward ສູງເຖິງ 1:3."
    }
]

@router.get("/entries", summary="Get trading journal entries with AI self-reflection")
def get_journal_entries():
    return {
        "totalTrades": len(JOURNAL_ENTRIES),
        "winCount": sum(1 for e in JOURNAL_ENTRIES if e["result"] == "WIN"),
        "lossCount": sum(1 for e in JOURNAL_ENTRIES if e["result"] == "LOSS"),
        "entries": JOURNAL_ENTRIES
    }

@router.post("/entries", summary="Add new trade entry")
def create_journal_entry(entry: JournalEntryCreate):
    new_entry = {
        "id": f"j-{len(JOURNAL_ENTRIES) + 1}",
        "date": datetime.utcnow().strftime("%Y-%m-%d"),
        "symbol": entry.symbol,
        "action": entry.action,
        "entryPrice": entry.entryPrice,
        "exitPrice": entry.exitPrice or entry.entryPrice,
        "pnlUsd": entry.pnlUsd or 0.0,
        "pnlPercent": 0.0,
        "result": entry.result or "OPEN",
        "reasonLao": entry.reasonLao,
        "aiSelfReflectionLao": f"🤖 AI ກຳລັງຕິດຕາມຜົນການເທຣດ {entry.symbol} ເພື່ອປະເມີນ ແລະ ປັບແຕ່ງຕົວແບບ AI Consensus ໃຫ້ແມ່ນຍຳຂຶ້ນ."
    }
    JOURNAL_ENTRIES.insert(0, new_entry)
    return new_entry
