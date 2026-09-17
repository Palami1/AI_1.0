from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api import auth, users, market, ai, portfolio, risk
from app.api import websocket as ws_router
from app.api import paper_trading
from app.api import observability
from app.api import health
from app.api import scanner
from app.api import smart_money
from app.api import learning
from app.api import chat
from app.api import replay
from app.api import alerts
from app.api import brain
from app.api import radar
from app.api import liquidity
from app.api import journal

app = FastAPI(
    title="LAO AI INVESTMENT OS V5.0 API",
    version="5.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to LAO AI INVESTMENT OS V5.0 — Institutional Edition API",
        "version": "V5.0 Institutional Edition",
        "status": "Online",
        "modules": [
            "Global Market Brain", "AI Opportunity Radar (1000 Coins)",
            "Liquidity & Liquidation Heatmap", "10-Agent AI Consensus V2",
            "Whale Intelligence", "Smart Money Score", "Confidence Calibration 2.0",
            "Replay Lab", "AI Chat Analyst Pro", "Portfolio Intelligence",
            "Notification Center Pro", "AI Journal & Self-Reflection"
        ]
    }

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(market.router, prefix=f"{settings.API_V1_STR}/market", tags=["Market Data"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Engine"])
app.include_router(portfolio.router, prefix=f"{settings.API_V1_STR}/portfolio", tags=["Portfolio"])
app.include_router(risk.router, prefix=f"{settings.API_V1_STR}/risk", tags=["Risk Management"])
app.include_router(scanner.router, prefix=f"{settings.API_V1_STR}/scanner", tags=["Smart Scanner"])
app.include_router(smart_money.router, prefix=f"{settings.API_V1_STR}/smart-money", tags=["Smart Money"])
app.include_router(learning.router, prefix=f"{settings.API_V1_STR}/learning", tags=["AI Learning"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["AI Chat Analyst"])
app.include_router(replay.router, prefix=f"{settings.API_V1_STR}/replay", tags=["Replay Mode"])
app.include_router(alerts.router, prefix=f"{settings.API_V1_STR}/alerts", tags=["Notification Center"])
app.include_router(brain.router, prefix=f"{settings.API_V1_STR}/brain", tags=["Global Market Brain"])
app.include_router(radar.router, prefix=f"{settings.API_V1_STR}/radar", tags=["Opportunity Radar"])
app.include_router(liquidity.router, prefix=f"{settings.API_V1_STR}/liquidity", tags=["Liquidity Heatmap"])
app.include_router(journal.router, prefix=f"{settings.API_V1_STR}/journal", tags=["AI Journal"])
app.include_router(ws_router.router, tags=["WebSocket Live"])
app.include_router(paper_trading.router, prefix=f"{settings.API_V1_STR}/paper", tags=["Paper Trading"])
app.include_router(observability.router, prefix=f"{settings.API_V1_STR}/observe", tags=["Observability"])
app.include_router(health.router, tags=["Health Check"])
