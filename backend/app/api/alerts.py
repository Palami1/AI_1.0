from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter()

class CustomAlertRule(BaseModel):
    symbol: str
    conditionType: str # PRICE_ABOVE, PRICE_BELOW, RSI_OVERBOUGHT, RSI_OVERSOLD, WHALE_TRANSACTION
    targetValue: float
    note: str = ""

CUSTOM_ALERTS_STORE = [
    {
        "id": "alt-rule-1",
        "symbol": "BTC/USDT",
        "conditionType": "PRICE_ABOVE",
        "conditionText": "ລາຄາທະລຸເໜືອ $68,000",
        "targetValue": 68000,
        "status": "ACTIVE",
        "createdAt": "2026-03-17 14:00"
    },
    {
        "id": "alt-rule-2",
        "symbol": "SOL/USDT",
        "conditionType": "RSI_OVERSOLD",
        "conditionText": "RSI ຫຼຸດຕ່ຳກວ່າ 30 (Oversold)",
        "targetValue": 30,
        "status": "ACTIVE",
        "createdAt": "2026-03-17 15:30"
    },
    {
        "id": "alt-rule-3",
        "symbol": "TAO/USDT",
        "conditionType": "WHALE_TRANSACTION",
        "conditionText": "ລາຍການໂອນປາວານໃຫຍ່ກວ່າ $10M",
        "targetValue": 10000000,
        "status": "TRIGGERED",
        "triggeredAt": "17:41:05",
        "createdAt": "2026-03-17 16:10"
    }
]

@router.get("/rules", summary="Get user alert rules")
def get_alert_rules():
    return CUSTOM_ALERTS_STORE

@router.post("/rules", summary="Create a new custom alert rule")
def create_alert_rule(rule: CustomAlertRule):
    new_id = f"alt-rule-{len(CUSTOM_ALERTS_STORE) + 1}"
    cond_text = f"{rule.symbol} {rule.conditionType} {rule.targetValue}"
    if rule.conditionType == "PRICE_ABOVE":
        cond_text = f"ລາຄາທະລຸເໜືອ ${rule.targetValue:,.2f}"
    elif rule.conditionType == "PRICE_BELOW":
        cond_text = f"ລາຄາຫຼຸດຕ່ຳກວ່າ ${rule.targetValue:,.2f}"
    elif rule.conditionType == "RSI_OVERSOLD":
        cond_text = f"RSI ຫຼຸດຕ່ຳກວ່າ {rule.targetValue}"
    elif rule.conditionType == "WHALE_TRANSACTION":
        cond_text = f"ປາວານໂອນໃຫຍ່ກວ່າ ${rule.targetValue:,.0f}"

    item = {
        "id": new_id,
        "symbol": rule.symbol,
        "conditionType": rule.conditionType,
        "conditionText": cond_text,
        "targetValue": rule.targetValue,
        "status": "ACTIVE",
        "createdAt": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    }
    CUSTOM_ALERTS_STORE.insert(0, item)
    return item
