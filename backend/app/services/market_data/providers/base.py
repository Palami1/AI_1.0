from abc import ABC, abstractmethod
from typing import Optional
import pandas as pd

class MarketDataProvider(ABC):
    """
    Abstract Base Class for all market data providers.
    Swap Binance → Yahoo → Alpha Vantage without touching business logic.
    """
    
    name: str = "base"
    
    @abstractmethod
    def fetch_ohlcv(self, symbol: str, timeframe: str = "1d", limit: int = 200) -> pd.DataFrame:
        """
        Fetches OHLCV data. Must return a DataFrame with columns:
        [open, high, low, close, volume] indexed by timestamp (UTC).
        """
        raise NotImplementedError

    @abstractmethod
    def is_available(self) -> bool:
        """Health check for this provider's API connection."""
        raise NotImplementedError

    @staticmethod
    def _empty_df() -> pd.DataFrame:
        return pd.DataFrame(columns=["open", "high", "low", "close", "volume"])
