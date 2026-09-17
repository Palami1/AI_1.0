from fastapi import APIRouter, Query
from typing import Optional
from app.services.crypto_service import crypto_service

router = APIRouter()

@router.get("/overview", summary="Get global crypto market overview")
def get_overview():
    return crypto_service.get_market_overview()

@router.get("/coins", summary="Get crypto list with search and categories")
def get_coins(
    category: Optional[str] = Query(default=None, description="Category filter (AI, Meme, DeFi, Layer1, Gaming)"),
    limit: int = Query(default=100, ge=1, le=500),
    search: Optional[str] = Query(default=None)
):
    return crypto_service.get_coins(category=category, rank_limit=limit, search=search)

@router.get("/coins/{symbol}", summary="Get specific coin detail and technical indicators")
def get_coin_detail(symbol: str):
    coin = crypto_service.get_coin_detail(symbol)
    if not coin:
        return {"error": "Coin not found"}
    return coin

@router.get("/whales", summary="Get live Whale Tracker feed")
def get_whale_feed():
    return crypto_service.get_whale_events()

@router.get("/heatmap", summary="Get crypto market heatmap data")
def get_heatmap():
    return crypto_service.get_heatmap_data()
