import pandas as pd
from datetime import datetime
import numpy as np

class DataQualityMonitor:
    """
    Monitors market data quality and tracks API status.
    AI CANNOT ANALYZE IF DATA_HEALTH < 80
    """
    
    REQUIRED_HEALTH_LEVEL = 80.0
    
    @staticmethod
    def calculate_health_score(df: pd.DataFrame) -> dict:
        """
        Calculates a data health score from 0-100 based on data anomalies.
        """
        if df.empty:
            return {"score": 0.0, "issues": ["Empty DataFrame"]}
            
        score = 100.0
        issues = []
        
        # 1. Missing Data (NaNs)
        missing_count = df.isna().sum().sum()
        if missing_count > 0:
            penalty = min(missing_count * 2, 40)
            score -= penalty
            issues.append(f"Missing data: {missing_count} NaN values found.")
            
        # 2. Duplicate Indexes
        duplicate_count = df.index.duplicated().sum()
        if duplicate_count > 0:
            score -= 20
            issues.append(f"Duplicate data: {duplicate_count} duplicate timestamps.")
            
        # 3. Price Anomalies (High < Low)
        anomaly_count = len(df[df['high'] < df['low']])
        if anomaly_count > 0:
            score -= 30
            issues.append(f"Price anomaly: High < Low on {anomaly_count} rows.")
            
        # 4. Outliers (Price jumping more than 50% in a single period for crypto/stocks)
        if len(df) > 1:
            pct_change = df['close'].pct_change().abs()
            outlier_count = len(pct_change[pct_change > 0.5])
            if outlier_count > 0:
                score -= 15
                issues.append(f"Outlier detected: Extreme price jumps on {outlier_count} periods.")
                
        # Ensure score stays in 0-100 bound
        score = max(0.0, min(100.0, score))
        
        return {
            "score": score,
            "is_valid_for_ai": score >= DataQualityMonitor.REQUIRED_HEALTH_LEVEL,
            "issues": issues,
            "last_check_time": datetime.utcnow().isoformat()
        }
        
    @staticmethod
    def track_api_status(api_name: str, is_online: bool, last_update: datetime):
        """
        Tracks API status and errors for the Data Monitor Service.
        In production, this would write to a Redis cache or Database log.
        """
        return {
            "api": api_name,
            "status": "ONLINE" if is_online else "OFFLINE",
            "last_update": last_update.isoformat()
        }
