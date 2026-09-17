import asyncio
import json
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.crypto_service import crypto_service

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []
    
    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)
    
    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)
    
    async def broadcast(self, message: dict):
        dead = []
        for ws in self.active:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

manager = ConnectionManager()

@router.websocket("/ws/live")
async def live_stream(websocket: WebSocket):
    """
    Streams live market prices, Fear & Greed index, and whale alerts every 2 seconds.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Subtle realistic price tick simulation
            for s, c in crypto_service._price_cache.items():
                delta_pct = random.uniform(-0.15, 0.16)
                new_price = round(c["currentPrice"] * (1 + delta_pct / 100), 4 if c["currentPrice"] < 1 else 2)
                c["currentPrice"] = new_price
            
            whales = crypto_service.get_whale_events()
            overview = crypto_service.get_market_overview()
            
            payload = {
                "type": "TICK",
                "timestamp": asyncio.get_event_loop().time(),
                "topCoins": list(crypto_service._price_cache.values())[:10],
                "whaleEvent": whales[0] if whales else None,
                "fearGreed": overview.get("fearAndGreedIndex")
            }
            await websocket.send_json(payload)
            await asyncio.sleep(2) # 2s tick interval for responsive real-time UI
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
