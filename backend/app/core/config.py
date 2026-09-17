try:
    from pydantic_settings import BaseSettings
except ImportError:
    class BaseSettings:
        pass
from typing import Dict, Any

class Settings(BaseSettings):
    PROJECT_NAME: str = "LAO AI INVESTMENT OS V5.2 API"
    VERSION: str = "5.2.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "super_secret_key_for_jwt_auth_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    
    MASTER_PIN: str = "888888"
    MASTER_PASSWORD: str = "laoai2026"
    
    # Quantitative Strategy Profiles & Dynamic Execution Cost Model
    STRATEGY_PROFILES: Dict[str, Dict[str, Any]] = {
        "STANDARD_V5_2": {
            "name": "Standard Quant Profile (ມາດຕະຖານ)",
            "version": "v5.2.1-std",
            "minOpportunityForBuy": 85.0,
            "minConfidenceForBuy": 70.0,
            "maxRiskForBuy": 50.0,
            "minOpportunityForMonitor": 70.0,
            "maxRiskForNoTrade": 75.0,
            "agentConflictThreshold": 4, # 4 BUY vs 4 SELL triggers NO TRADE
            "executionCostModel": {
                "exchange": "Binance / Bybit Top Tier",
                "makerFeePercent": 0.04,
                "takerFeePercent": 0.08,
                "baseSlippagePercent": 0.05,
                "typicalSpreadPercent": 0.02,
                "marketImpactModel": "SquareRootLaw (Linear up to $50k size)",
                "totalEstimatedRoundtripCostPercent": 0.23
            }
        },
        "CONSERVATIVE_V5_2": {
            "name": "Conservative Capital Protection (ເນັ້ນປ້ອງກັນຕົ້ນທຶນ)",
            "version": "v5.2.1-cons",
            "minOpportunityForBuy": 88.0,
            "minConfidenceForBuy": 75.0,
            "maxRiskForBuy": 40.0,
            "minOpportunityForMonitor": 75.0,
            "maxRiskForNoTrade": 65.0,
            "agentConflictThreshold": 3,
            "executionCostModel": {
                "exchange": "High Liquidity Venues Only",
                "makerFeePercent": 0.02,
                "takerFeePercent": 0.06,
                "baseSlippagePercent": 0.03,
                "typicalSpreadPercent": 0.015,
                "marketImpactModel": "ZeroImpactThreshold (Strict Limit Orders)",
                "totalEstimatedRoundtripCostPercent": 0.145
            }
        }
    }

    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "lao_ai_db"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
