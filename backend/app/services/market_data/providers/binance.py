import pandas as pd
from typing import Optional
from app.services.market_data.providers.base import MarketDataProvider

class BinanceProvider(MarketDataProvider):
    """
    Fetches crypto OHLCV data from Binance via the CCXT library.
    Supports: BTC/USDT, ETH/USDT, BNB/USDT, etc.
    """
    
    name = "binance"
    
    TIMEFRAME_MAP = {
        "1m": "1m", "5m": "5m", "15m": "15m",
        "1h": "1h", "4h": "4h", "1d": "1d", "1w": "1w"
    }
    
    def __init__(self):
        self._exchange = None
        self._init_exchange()
    
    def _init_exchange(self):
        try:
            import ccxt
            self._exchange = ccxt.binance({
                "enableRateLimit": True,
                "options": {"defaultType": "spot"},
            })
        except ImportError:
            print("CCXT not installed. Run: pip install ccxt")
        except Exception as e:
            print(f"Binance init error: {e}")

    def is_available(self) -> bool:
        try:
            if not self._exchange:
                return False
            self._exchange.fetch_ticker("BTC/USDT")
            return True
        except Exception:
            return False

    def fetch_ohlcv(self, symbol: str, timeframe: str = "1d", limit: int = 200) -> pd.DataFrame:
        try:
            if not self._exchange:
                return self._empty_df()
                
            tf = self.TIMEFRAME_MAP.get(timeframe, "1d")
            raw = self._exchange.fetch_ohlcv(symbol, tf, limit=limit)
            
            df = pd.DataFrame(raw, columns=["timestamp", "open", "high", "low", "close", "volume"])
            df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms", utc=True)
            df.set_index("timestamp", inplace=True)
            return df
        except Exception as e:
            print(f"Binance fetch error for {symbol}: {e}")
            return self._empty_df()
