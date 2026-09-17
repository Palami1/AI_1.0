import pandas as pd

class MarketDataValidator:
    """
    Validates and cleans raw market data before it hits the database or AI Engine.
    """
    
    @staticmethod
    def clean_data(df: pd.DataFrame) -> pd.DataFrame:
        """
        Handles missing values, forward-fills gaps, and ensures data integrity.
        """
        if df.empty:
            raise ValueError("Dataframe is empty.")
            
        # 1. Drop duplicates
        df = df[~df.index.duplicated(keep='last')]
        
        # 2. Forward fill missing values (common in weekends for stocks, or low liquidity crypto)
        df.ffill(inplace=True)
        
        # 3. Drop any remaining NaNs (e.g. at the very beginning of the series)
        df.dropna(inplace=True)
        
        # 4. Validate constraints (High >= Low, Volume >= 0)
        invalid_mask = (df['high'] < df['low']) | (df['volume'] < 0)
        if invalid_mask.any():
            # In a strict system, we might raise an error. Here we filter bad rows.
            df = df[~invalid_mask]
            
        return df
