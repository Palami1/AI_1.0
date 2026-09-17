import pandas as pd
from app.services.market_data.providers.base import MarketDataProvider

class YahooProvider(MarketDataProvider):
    """
    Fetches stock OHLCV data via yfinance.
    Supports: AAPL, TSLA, NVDA, MSFT, etc.
    """
    
    name = "yahoo"
    
    TIMEFRAME_MAP = {
        "1m": "1m", "5m": "5m", "15m": "15m",
        "1h": "1h", "1d": "1d", "1w": "1wk", "1mo": "1mo"
    }
    
    def is_available(self) -> bool:
        try:
            import yfinance as yf
            ticker = yf.Ticker("AAPL")
            info = ticker.fast_info
            return info.last_price > 0
        except Exception:
            return False

    def fetch_ohlcv(self, symbol: str, timeframe: str = "1d", limit: int = 200) -> pd.DataFrame:
        try:
            import yfinance as yf
            period_map = {
                "1m": "7d", "5m": "60d", "15m": "60d",
                "1h": "730d", "1d": "5y", "1w": "max", "1mo": "max"
            }
            tf = self.TIMEFRAME_MAP.get(timeframe, "1d")
            period = period_map.get(timeframe, "5y")
            
            df = yf.download(symbol, period=period, interval=tf, progress=False, auto_adjust=True)
            
            if df.empty:
                return self._empty_df()
                
            df.columns = [c.lower() for c in df.columns]
            df.index = pd.to_datetime(df.index, utc=True)
            
            return df[["open", "high", "low", "close", "volume"]].tail(limit)
        except Exception as e:
            print(f"Yahoo fetch error for {symbol}: {e}")
            return self._empty_df()
