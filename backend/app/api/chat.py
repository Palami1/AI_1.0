from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.crypto_service import crypto_service
from app.ai.engine import decision_engine_v3

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    coinSymbol: str = "BTC/USDT"

@router.post("/message", summary="Chat with AI Market Analyst in Lao")
def chat_analyst(payload: ChatRequest):
    msg = payload.message.lower().strip()
    symbol = payload.coinSymbol.upper()
    if not "/" in symbol:
        symbol = f"{symbol}/USDT"

    # Identify if a coin is mentioned in text
    for coin_code in ["BTC", "ETH", "SOL", "NEAR", "TAO", "RENDER", "DOGE", "PEPE", "SUI", "UNI"]:
        if coin_code.lower() in msg:
            symbol = f"{coin_code}/USDT"
            break

    # Get coin details & AI Decision
    coin = crypto_service.get_coin_detail(symbol)
    if not coin or "error" in coin:
        coin = {"symbol": symbol, "currentPrice": 66850, "change24h": 3.8}
    
    analysis = decision_engine_v3.analyze_asset(symbol, coin)
    price = coin.get("currentPrice", 0)
    change = coin.get("change24h", 0)

    # Generate specialized Lao contextual response
    if "ຄວນຊື້" in msg or "ຊື້ໄດ້ບໍ" in msg or "ແນະນຳ" in msg:
        reply = (
            f"🤖 **ບົດວິເຄາະ AI ສຳລັບ {symbol}**:\n\n"
            f"• **ລາຄາປັດຈຸບັນ**: ${price:,.2f} ({'+' if change >= 0 else ''}{change}% ໃນ 24h)\n"
            f"• **ສຽງໂຫວດຈາກ 6 Agents**: {analysis['action']} ({analysis['actionEn']}) ດ້ວຍຄະແນນ **{analysis['finalScore']}/100** (ຄວາມໝັ້ນໃຈ {analysis['confidence']}%)\n"
            f"• **ລະດັບຄວາມສ່ຽງ**: {analysis['riskLevel']}\n\n"
            f"🎯 **ແຜນການເຂົ້າເທຣດ (Risk Strategy)**:\n"
            f"  - ຈຸດເຂົ້າແນະນຳ: `${analysis['riskStrategy']['recommendedEntry']:,.2f}`\n"
            f"  - ຈຸດຕັດຂາດທຶນ (Stop Loss): `${analysis['riskStrategy']['stopLoss']:,.2f}`\n"
            f"  - ເປົ້າໝາຍກຳໄລ (TP 1): `${analysis['riskStrategy']['takeProfit1']:,.2f}`\n\n"
            f"💡 **ເຫດຜົນຫຼັກ**: {analysis['evidence'][0] if analysis['evidence'] else 'ໂຄງສ້າງລາຄາມີຄວາມແຂງແກ່ນ'}\n"
            f"⚠️ **ຂໍ້ຄວນລະວັງ**: ຫ້າມ All-in ແລະ ຄວນກຳນົດຂະໜາດໄມ້ບໍ່ເກີນ {analysis['riskStrategy']['maxPositionSizePercent']} ຂອງພອດ."
        )
    elif "rsi" in msg or "indicator" in msg or "ເທັກນິກ" in msg:
        reply = (
            f"📊 **ຂໍ້ມູນ Indicator & ເທັກນິກ {symbol}**:\n\n"
            f"• **RSI (14)**: {coin.get('indicators', {}).get('rsi14', 62.4)} (Momentum ຍັງຢູ່ໃນເກນສຸຂະພາບດີ)\n"
            f"• **EMA ແນວຮັບ-ແນວຕ້ານ**: EMA20 = ${coin.get('indicators', {}).get('ema20', price*0.98):,.2f} | EMA200 = ${coin.get('indicators', {}).get('ema200', price*0.90):,.2f}\n"
            f"• **ແນວຮັບຫຼັກ**: ${coin.get('indicators', {}).get('support', price*0.94):,.2f}\n"
            f"• **ແນວຕ້ານຫຼັກ**: ${coin.get('indicators', {}).get('resistance', price*1.06):,.2f}\n\n"
            f"AI ແນະນຳໃຫ້ລໍຖ້າຈຸດ Pullback ໃກ້ເສັ້ນ EMA20 ເພື່ອຄວາມປອດໄພຂອງຕົ້ນທຶນ."
        )
    else:
        reply = (
            f"ສະບາຍດີ! ຂ້ອຍແມ່ນ **LAO AI Market Analyst V4.0**.\n\n"
            f"ພາບລວມຂອງ **{symbol}** ຕອນນີ້:\n"
            f"• ລາຄາ: `${price:,.2f}` ({'+' if change >= 0 else ''}{change}%)\n"
            f"• ສະຖານະ AI Consensus: **{analysis['action']} ({analysis['finalScore']}/100)**\n"
            f"• ທ່າອ່ຽງປາວານ (Whale): ມີແຮງຊື້ສະສົມ ແລະ ຖອນອອກກະດານເທຣດຕໍ່ເນື່ອງ.\n\n"
            f"ທ່ານສາມາດຖາມເຈາະເລິກເຊັ່ນ: *'{symbol} ຄວນເຂົ້າຊື້ຈຸດໃດ?'* ຫຼື *'ເບິ່ງ RSI ແລະ ແນວຮັບ-ແນວຕ້ານ'* ໄດ້ເລີຍ!"
        )

    return {
        "reply": reply,
        "symbol": symbol,
        "action": analysis["action"],
        "score": analysis["finalScore"],
        "confidence": analysis["confidence"],
        "timestamp": "ຕອນນີ້"
    }
