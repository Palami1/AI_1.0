import random
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

# Pre-defined top crypto assets with categories and base data
CRYPTO_ASSETS = [
    {"symbol": "BTC/USDT", "name": "Bitcoin", "code": "BTC", "category": "Layer1", "marketCap": 1320000000000, "basePrice": 66850.0, "rank": 1},
    {"symbol": "ETH/USDT", "name": "Ethereum", "code": "ETH", "category": "Layer1", "marketCap": 410000000000, "basePrice": 3480.0, "rank": 2},
    {"symbol": "SOL/USDT", "name": "Solana", "code": "SOL", "category": "Layer1", "marketCap": 86000000000, "basePrice": 182.5, "rank": 3},
    {"symbol": "BNB/USDT", "name": "BNB", "code": "BNB", "category": "Layer1", "marketCap": 84000000000, "basePrice": 575.0, "rank": 4},
    {"symbol": "NEAR/USDT", "name": "NEAR Protocol", "code": "NEAR", "category": "AI", "marketCap": 7800000000, "basePrice": 6.85, "rank": 5},
    {"symbol": "RNDR/USDT", "name": "Render Network", "code": "RENDER", "category": "AI", "marketCap": 5400000000, "basePrice": 9.20, "rank": 6},
    {"symbol": "FET/USDT", "name": "Artificial Superintelligence Alliance", "code": "FET", "category": "AI", "marketCap": 4200000000, "basePrice": 1.64, "rank": 7},
    {"symbol": "TAO/USDT", "name": "Bittensor", "code": "TAO", "category": "AI", "marketCap": 3900000000, "basePrice": 535.0, "rank": 8},
    {"symbol": "UNI/USDT", "name": "Uniswap", "code": "UNI", "category": "DeFi", "marketCap": 6200000000, "basePrice": 10.45, "rank": 9},
    {"symbol": "AAVE/USDT", "name": "Aave", "code": "AAVE", "category": "DeFi", "marketCap": 2300000000, "basePrice": 158.2, "rank": 10},
    {"symbol": "MKR/USDT", "name": "Maker", "code": "MKR", "category": "DeFi", "marketCap": 1900000000, "basePrice": 2150.0, "rank": 11},
    {"symbol": "DOGE/USDT", "name": "Dogecoin", "code": "DOGE", "category": "Meme", "marketCap": 22000000000, "basePrice": 0.148, "rank": 12},
    {"symbol": "SHIB/USDT", "name": "Shiba Inu", "code": "SHIB", "category": "Meme", "marketCap": 11500000000, "basePrice": 0.0000192, "rank": 13},
    {"symbol": "PEPE/USDT", "name": "Pepe", "code": "PEPE", "category": "Meme", "marketCap": 4800000000, "basePrice": 0.0000114, "rank": 14},
    {"symbol": "WIF/USDT", "name": "dogwifhat", "code": "WIF", "category": "Meme", "marketCap": 2600000000, "basePrice": 2.58, "rank": 15},
    {"symbol": "GALA/USDT", "name": "GALA Games", "code": "GALA", "category": "Gaming", "marketCap": 1100000000, "basePrice": 0.0275, "rank": 16},
    {"symbol": "IMX/USDT", "name": "Immutable", "code": "IMX", "category": "Gaming", "marketCap": 2700000000, "basePrice": 1.72, "rank": 17},
    {"symbol": "AXS/USDT", "name": "Axie Infinity", "code": "AXS", "category": "Gaming", "marketCap": 850000000, "basePrice": 5.92, "rank": 18},
    {"symbol": "AVAX/USDT", "name": "Avalanche", "code": "AVAX", "category": "Layer1", "marketCap": 11200000000, "basePrice": 28.4, "rank": 19},
    {"symbol": "SUI/USDT", "name": "Sui Network", "code": "SUI", "category": "Layer1", "marketCap": 4900000000, "basePrice": 1.95, "rank": 20},
]

class CryptoService:
    def __init__(self):
        self._price_cache: Dict[str, Dict[str, Any]] = {}
        self._last_whale_time = time.time()
        self._whale_events: List[Dict[str, Any]] = []
        self._init_data()

    def _init_data(self):
        for item in CRYPTO_ASSETS:
            change_24h = round(random.uniform(-4.5, 9.8), 2)
            high_24h = round(item["basePrice"] * 1.05, 4 if item["basePrice"] < 1 else 2)
            low_24h = round(item["basePrice"] * 0.95, 4 if item["basePrice"] < 1 else 2)
            volume_24h = round(item["marketCap"] * random.uniform(0.04, 0.12), 2)
            
            self._price_cache[item["symbol"]] = {
                **item,
                "currentPrice": item["basePrice"],
                "change24h": change_24h,
                "high24h": high_24h,
                "low24h": low_24h,
                "volume24h": volume_24h,
                "lastUpdated": datetime.utcnow().isoformat()
            }
        
        # Generate initial whale events
        self._generate_initial_whales()

    def _generate_initial_whales(self):
        actions = [
            ("ຊື້ໃຫຍ່ (Whale Buy)", "BUY", "BTC", 350, 23400000, "Coinbase Pro -> 0x8f2a...c4"),
            ("ໂອນເຂົ້າກະດານ (Exchange Inflow)", "INFLOW", "ETH", 8500, 29580000, "0x3e1d...9a -> Binance"),
            ("ຖອນອອກກະດານ (Exchange Outflow)", "OUTFLOW", "SOL", 140000, 25550000, "Kraken -> Cold Wallet 0x7c..."),
            ("ຂາຍໃຫຍ່ (Whale Sell)", "SELL", "NEAR", 2500000, 17125000, "0x11ab...ff -> Binance"),
            ("ຊື້ສະສົມ (Whale Accumulate)", "BUY", "TAO", 15000, 8025000, "Binance -> 0x44bb...11"),
            ("ໂອນໃຫຍ່ (Whale Transfer)", "TRANSFER", "BTC", 820, 54817000, "Unknown Wallet -> Unknown Wallet")
        ]
        for act, typ, coin, qty, val, route in actions:
            self._whale_events.append({
                "id": f"wh-{random.randint(1000, 9999)}",
                "action": act,
                "type": typ,
                "coin": coin,
                "amount": qty,
                "valueUsd": val,
                "route": route,
                "timestamp": (datetime.utcnow() - timedelta(minutes=random.randint(2, 45))).strftime("%H:%M:%S")
            })

    def get_market_overview(self) -> Dict[str, Any]:
        """Global Market Overview metrics in Lao"""
        total_mcap = sum(c["marketCap"] for c in CRYPTO_ASSETS) + 850000000000
        btc_data = self._price_cache.get("BTC/USDT", {})
        btc_mcap = btc_data.get("marketCap", 1320000000000)
        btc_dominance = round((btc_mcap / total_mcap) * 100, 1)

        # Sort gainers & losers
        all_coins = list(self._price_cache.values())
        sorted_coins = sorted(all_coins, key=lambda x: x["change24h"], reverse=True)

        return {
            "totalMarketCap": total_mcap,
            "totalMarketCapFormatted": "$2.38T",
            "marketCapChange24h": 3.42,
            "btcDominance": btc_dominance,
            "ethDominance": 17.2,
            "fearAndGreedIndex": {
                "score": 74,
                "status": "ໂລບມາກ (Greed)",
                "sentiment": "BULLISH"
            },
            "topGainers": sorted_coins[:4],
            "topLosers": sorted_coins[-4:][::-1],
            "aiAlerts": [
                {
                    "id": "alt-1",
                    "symbol": "BTC/USDT",
                    "title": "ສັນຍານຊື້ແຮງ (Strong Bullish Pattern)",
                    "message": "BTC ມີຄວາມໜ້າເຊື່ອຖື 91% ພ້ອມແຮງຊື້ສະສົມຈາກ Whale ຕໍ່ເນື່ອງ",
                    "action": "BUY",
                    "confidence": 91,
                    "time": "5 ນາທີກ່ອນ"
                },
                {
                    "id": "alt-2",
                    "symbol": "SOL/USDT",
                    "title": "ປະລິມານການຊື້ເພີ່ມຂຶ້ນຜິດປົກກະຕິ",
                    "message": "SOL ປະລິມານຊື້ 24h ເພີ່ມຂຶ້ນ 45% ທະລຸແນວຕ້ານ $180",
                    "action": "BUY",
                    "confidence": 84,
                    "time": "12 ນາທີກ່ອນ"
                },
                {
                    "id": "alt-3",
                    "symbol": "NEAR/USDT",
                    "title": "ກຸ່ມ AI Token ເຂົ້າສູ່ Momentum ຮອບໃໝ່",
                    "message": "NEAR RSI ຢູ່ 68 ພ້ອມ Volume Breakout",
                    "action": "BUY",
                    "confidence": 88,
                    "time": "25 ນາທີກ່ອນ"
                }
            ]
        }

    def get_coins(self, category: Optional[str] = None, rank_limit: int = 100, search: Optional[str] = None) -> List[Dict[str, Any]]:
        """Returns coin list filtered by rank, category, and search"""
        results = list(self._price_cache.values())
        
        if search:
            q = search.lower().strip()
            results = [c for c in results if q in c["name"].lower() or q in c["code"].lower() or q in c["symbol"].lower()]

        if category and category.lower() != "all" and category.lower() != "ທັງໝົດ":
            results = [c for c in results if c["category"].lower() == category.lower()]

        results = sorted(results, key=lambda x: x["rank"])
        return results[:rank_limit]

    def get_coin_detail(self, symbol: str) -> Optional[Dict[str, Any]]:
        # Normalize symbol
        s = symbol.upper()
        if not s.endswith("/USDT") and not "/" in s:
            s = f"{s}/USDT"
            
        coin = self._price_cache.get(s)
        if not coin:
            # Try finding by code
            for c in self._price_cache.values():
                if c["code"].upper() == symbol.upper() or c["name"].lower() == symbol.lower():
                    coin = c
                    break
        
        if not coin:
            return None

        # Technical Indicators calculation simulation
        price = coin["currentPrice"]
        return {
            **coin,
            "indicators": {
                "rsi14": round(random.uniform(54.0, 72.5), 1),
                "macd": {"macd": 12.4, "signal": 9.8, "hist": 2.6, "trend": "BULLISH"},
                "ema20": round(price * 0.985, 2),
                "ema50": round(price * 0.962, 2),
                "ema200": round(price * 0.895, 2),
                "bollinger": {
                    "upper": round(price * 1.045, 2),
                    "middle": round(price * 1.0, 2),
                    "lower": round(price * 0.955, 2)
                },
                "support": round(price * 0.94, 2),
                "resistance": round(price * 1.06, 2),
                "atr": round(price * 0.038, 2)
            }
        }

    def get_whale_events(self) -> List[Dict[str, Any]]:
        # Periodically insert fresh simulated whale movement
        if time.time() - self._last_whale_time > 15:
            self._last_whale_time = time.time()
            coins = ["BTC", "ETH", "SOL", "NEAR", "RENDER", "TAO"]
            coin = random.choice(coins)
            val = random.randint(3000000, 45000000)
            typ = random.choice(["BUY", "SELL", "INFLOW", "OUTFLOW"])
            actions_dict = {
                "BUY": "ຊື້ໃຫຍ່ (Whale Buy)",
                "SELL": "ຂາຍໃຫຍ່ (Whale Sell)",
                "INFLOW": "ໂອນເຂົ້າກະດານ (Inflow)",
                "OUTFLOW": "ຖອນອອກກະດານ (Outflow)"
            }
            new_event = {
                "id": f"wh-{random.randint(10000, 99999)}",
                "action": actions_dict[typ],
                "type": typ,
                "coin": coin,
                "amount": random.randint(100, 5000),
                "valueUsd": val,
                "route": f"0x{random.randint(1000,9999)}... -> Exchange",
                "timestamp": datetime.utcnow().strftime("%H:%M:%S")
            }
            self._whale_events.insert(0, new_event)
            if len(self._whale_events) > 30:
                self._whale_events.pop()
        
        return self._whale_events

    def get_heatmap_data(self) -> List[Dict[str, Any]]:
        """Returns data formatted for crypto heatmap visualization"""
        data = []
        for c in self._price_cache.values():
            data.append({
                "code": c["code"],
                "name": c["name"],
                "symbol": c["symbol"],
                "marketCap": c["marketCap"],
                "change24h": c["change24h"],
                "price": c["currentPrice"],
                "category": c["category"]
            })
        return data

crypto_service = CryptoService()
