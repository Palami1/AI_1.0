from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional

router = APIRouter()

# 1,000 Coins Opportunity Ranking Database simulation
OPPORTUNITY_RADAR_DATA = [
    {
        "rank": 1,
        "symbol": "BTC/USDT",
        "name": "Bitcoin",
        "code": "BTC",
        "opportunityScore": 94,
        "signalTrigger": "Breakout & ETF Inflow",
        "category": "Layer1",
        "price": 66850.0,
        "change24h": 3.85,
        "volume24h": "$32.4B",
        "fundingRate": "0.010%",
        "openInterest": "$34.8B",
        "consensus": "BUY (9/10)",
        "confidence": "89%"
    },
    {
        "rank": 2,
        "symbol": "SOL/USDT",
        "name": "Solana",
        "code": "SOL",
        "opportunityScore": 91,
        "signalTrigger": "Breakout $180 & Whale Buy",
        "category": "Layer1",
        "price": 182.5,
        "change24h": 8.95,
        "volume24h": "$5.8B",
        "fundingRate": "0.012%",
        "openInterest": "$2.8B",
        "consensus": "BUY (9/10)",
        "confidence": "86%"
    },
    {
        "rank": 3,
        "symbol": "TAO/USDT",
        "name": "Bittensor",
        "code": "TAO",
        "opportunityScore": 90,
        "signalTrigger": "Volume Spike (5.2x) & AI Rally",
        "category": "AI",
        "price": 535.0,
        "change24h": 14.8,
        "volume24h": "$480M",
        "fundingRate": "0.018%",
        "openInterest": "$185M",
        "consensus": "BUY (8/10)",
        "confidence": "84%"
    },
    {
        "rank": 4,
        "symbol": "SUI/USDT",
        "name": "Sui Network",
        "code": "SUI",
        "opportunityScore": 89,
        "signalTrigger": "Whale Accumulate & Outflow",
        "category": "Layer1",
        "price": 1.95,
        "change24h": 6.25,
        "volume24h": "$920M",
        "fundingRate": "0.009%",
        "openInterest": "$310M",
        "consensus": "BUY (8/10)",
        "confidence": "82%"
    },
    {
        "rank": 5,
        "symbol": "NEAR/USDT",
        "name": "NEAR Protocol",
        "code": "NEAR",
        "opportunityScore": 87,
        "signalTrigger": "MACD Golden Cross 4H",
        "category": "AI",
        "price": 6.85,
        "change24h": 7.60,
        "volume24h": "$640M",
        "fundingRate": "0.011%",
        "openInterest": "$220M",
        "consensus": "BUY (8/10)",
        "confidence": "81%"
    },
    {
        "rank": 6,
        "symbol": "ETH/USDT",
        "name": "Ethereum",
        "code": "ETH",
        "opportunityScore": 85,
        "signalTrigger": "ETF Accumulation & Staking",
        "category": "Layer1",
        "price": 3480.0,
        "change24h": 4.20,
        "volume24h": "$16.2B",
        "fundingRate": "0.008%",
        "openInterest": "$14.2B",
        "consensus": "BUY (7/10)",
        "confidence": "79%"
    },
    {
        "rank": 7,
        "symbol": "RENDER/USDT",
        "name": "Render Network",
        "code": "RENDER",
        "opportunityScore": 84,
        "signalTrigger": "AI Sector Momentum",
        "category": "AI",
        "price": 9.20,
        "change24h": 9.40,
        "volume24h": "$380M",
        "fundingRate": "0.014%",
        "openInterest": "$140M",
        "consensus": "BUY (7/10)",
        "confidence": "78%"
    },
    {
        "rank": 8,
        "symbol": "DOGE/USDT",
        "name": "Dogecoin",
        "code": "DOGE",
        "opportunityScore": 82,
        "signalTrigger": "Short Squeeze Potential",
        "category": "Meme",
        "price": 0.148,
        "change24h": 11.2,
        "volume24h": "$1.8B",
        "fundingRate": "0.024%",
        "openInterest": "$850M",
        "consensus": "BUY (7/10)",
        "confidence": "76%"
    },
    {
        "rank": 9,
        "symbol": "AAVE/USDT",
        "name": "Aave",
        "code": "AAVE",
        "opportunityScore": 80,
        "signalTrigger": "DeFi TVL Inflow",
        "category": "DeFi",
        "price": 158.2,
        "change24h": 5.10,
        "volume24h": "$210M",
        "fundingRate": "0.007%",
        "openInterest": "$95M",
        "consensus": "BUY (7/10)",
        "confidence": "75%"
    },
    {
        "rank": 10,
        "symbol": "UNI/USDT",
        "name": "Uniswap",
        "code": "UNI",
        "opportunityScore": 76,
        "signalTrigger": "RSI Oversold Bounce",
        "category": "DeFi",
        "price": 10.45,
        "change24h": -1.85,
        "volume24h": "$290M",
        "fundingRate": "0.005%",
        "openInterest": "$115M",
        "consensus": "MONITOR (6/10)",
        "confidence": "72%"
    }
]

@router.get("/rankings", summary="Get AI Opportunity Radar ranking for 1,000 coins")
def get_opportunity_rankings(
    category: Optional[str] = Query(default=None),
    min_score: int = Query(default=0, ge=0, le=100)
):
    results = OPPORTUNITY_RADAR_DATA
    if category and category.lower() != "all" and category.lower() != "ທັງໝົດ":
        results = [r for r in results if r["category"].lower() == category.lower()]
    
    results = [r for r in results if r["opportunityScore"] >= min_score]
    return {
        "scannedAssetsCount": 1000,
        "activeOpportunities": len(results),
        "rankings": results
    }
