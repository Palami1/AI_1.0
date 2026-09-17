import pandas as pd
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.services.market_data.providers.base import MarketDataProvider
from app.services.market_data.providers.binance import BinanceProvider
from app.services.market_data.providers.yahoo import YahooProvider
from app.services.market_data.validator import MarketDataValidator
from app.services.market_data.indicators import TechnicalIndicators
from app.services.market_data.quality import DataQualityMonitor
from app.database.session import SessionLocal
from app.models.base import MarketData, Stock

CRYPTO_SYMBOLS = {"BTC/USDT", "ETH/USDT", "BNB/USDT"}

class MarketDataOrchestrator:
    """
    Orchestrates real market data collection with automatic provider failover.
    Binance (primary for crypto) → Yahoo (fallback / stocks).
    """
    
    def __init__(self):
        self.binance = BinanceProvider()
        self.yahoo = YahooProvider()
    
    def _select_provider(self, symbol: str) -> MarketDataProvider:
        """Choose the right provider and fall back gracefully."""
        is_crypto = symbol.upper() in CRYPTO_SYMBOLS or "/" in symbol
        
        if is_crypto:
            if self.binance.is_available():
                return self.binance
            print(f"[FAILOVER] Binance unavailable for {symbol} — using Yahoo as fallback.")
            return self.yahoo
        else:
            if self.yahoo.is_available():
                return self.yahoo
            print(f"[FAILOVER] Yahoo unavailable for {symbol}.")
            return self.yahoo  # No secondary for stocks yet

    def fetch_and_store(self, symbol: str, timeframe: str = "1d", limit: int = 200) -> dict:
        """
        Full pipeline: Fetch → Validate → Add Indicators → Save to DB.
        Returns a status report.
        """
        db = SessionLocal()
        try:
            # 1. Fetch from provider (with failover)
            provider = self._select_provider(symbol)
            df = provider.fetch_ohlcv(symbol, timeframe, limit)
            
            if df.empty:
                return {"status": "ERROR", "reason": f"Provider {provider.name} returned empty data for {symbol}."}
            
            # 2. Validate & Clean
            df = MarketDataValidator.clean_data(df)
            
            # 3. Quality Gate
            health = DataQualityMonitor.calculate_health_score(df)
            if not health["is_valid_for_ai"]:
                return {
                    "status": "REJECTED",
                    "reason": f"Data quality score {health['score']:.1f} is below 80.",
                    "issues": health["issues"]
                }
            
            # 4. Add Indicators
            df = TechnicalIndicators.add_all_indicators(df)
            
            # 5. Upsert into PostgreSQL (avoid duplicates via the unique index)
            stock_id = symbol.lower().replace("/", "_")
            saved = 0
            for ts, row in df.iterrows():
                existing = db.query(MarketData).filter(
                    MarketData.stock_id == stock_id,
                    MarketData.timestamp == ts
                ).first()
                
                if not existing:
                    entry = MarketData(
                        stock_id=stock_id,
                        timestamp=ts,
                        open=float(row["open"]),
                        high=float(row["high"]),
                        low=float(row["low"]),
                        close=float(row["close"]),
                        volume=float(row["volume"])
                    )
                    db.add(entry)
                    saved += 1
                    
            db.commit()
            return {
                "status": "OK",
                "symbol": symbol,
                "provider": provider.name,
                "rows_saved": saved,
                "quality_score": health["score"],
                "last_close": float(df["close"].iloc[-1])
            }
        except Exception as e:
            db.rollback()
            return {"status": "ERROR", "reason": str(e)}
        finally:
            db.close()

    def get_latest_with_indicators(self, symbol: str, limit: int = 200) -> Optional[pd.DataFrame]:
        """
        Fetches data and returns a DataFrame with indicators for AI consumption.
        Returns None if quality check fails.
        """
        provider = self._select_provider(symbol)
        df = provider.fetch_ohlcv(symbol, "1d", limit)
        
        if df.empty:
            return None
        
        df = MarketDataValidator.clean_data(df)
        health = DataQualityMonitor.calculate_health_score(df)
        
        if not health["is_valid_for_ai"]:
            return None
            
        return TechnicalIndicators.add_all_indicators(df)
