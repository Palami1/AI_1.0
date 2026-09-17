import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.session import Base

class SoftDeleteMixin:
    is_deleted = Column(Boolean, default=False, index=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class User(Base, SoftDeleteMixin):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="USER", nullable=False)
    risk_level = Column(String, default="LOW", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    trade_history = relationship("TradeHistory", back_populates="user", cascade="all, delete-orphan")
    risk_logs = relationship("RiskLog", back_populates="user", cascade="all, delete-orphan")

class Stock(Base, SoftDeleteMixin):
    __tablename__ = "stocks"
    
    id = Column(String, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    market = Column(String, nullable=False)
    sector = Column(String)
    
    market_data = relationship("MarketData", back_populates="stock", cascade="all, delete-orphan")

class MarketData(Base):
    __tablename__ = "market_data"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stock_id = Column(String, ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    
    stock = relationship("Stock", back_populates="market_data")
    
    __table_args__ = (
        Index("ix_market_data_timestamp", "timestamp"),
        Index("ix_market_data_stock_id_timestamp", "stock_id", "timestamp", unique=True),
    )

class Portfolio(Base, SoftDeleteMixin):
    __tablename__ = "portfolios"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stock_id = Column(String, ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Float, nullable=False)
    average_price = Column(Float, nullable=False)
    
    user = relationship("User", back_populates="portfolios")
    stock = relationship("Stock")
    
    __table_args__ = (
        Index("ix_portfolio_user_stock", "user_id", "stock_id"),
    )

class TradeHistory(Base, SoftDeleteMixin):
    __tablename__ = "trade_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stock_id = Column(String, ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user = relationship("User", back_populates="trade_history")
    stock = relationship("Stock")
    
    __table_args__ = (
        Index("ix_trade_history_user_time", "user_id", "timestamp"),
    )

class AILog(Base):
    __tablename__ = "ai_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    symbol = Column(String, nullable=False)
    action = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    risk = Column(String, nullable=False)
    evidence = Column(JSONB, nullable=False)
    weakness = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    __table_args__ = (
        Index("ix_ai_logs_symbol_time", "symbol", "created_at"),
    )

class RiskLog(Base):
    __tablename__ = "risk_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    capital = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    position_size = Column(Float, nullable=False)
    max_loss = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user = relationship("User", back_populates="risk_logs")

# ==========================================
# PHASE 8: LEARNING SYSTEM TABLES
# ==========================================

class AgentPerformance(Base):
    """
    Tracks the historical performance of individual AI Agents.
    """
    __tablename__ = "agent_performance"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_name = Column(String, nullable=False, index=True)
    symbol = Column(String, nullable=False)
    prediction = Column(String, nullable=False) # BUY, SELL, WAIT
    confidence = Column(Float, nullable=False)
    actual_result = Column(String, default="PENDING") # WIN, LOSS, PENDING
    profit_loss = Column(Float, nullable=True) # Percentage e.g., +8.5
    accuracy_score = Column(Float, nullable=True) # +10, -10, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_agent_perf_name_time", "agent_name", "created_at"),
    )

class LearningLog(Base):
    """
    Logs changes and lessons learned by the Reinforcement Layer.
    """
    __tablename__ = "learning_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    decision_id = Column(UUID(as_uuid=True), ForeignKey("ai_logs.id", ondelete="CASCADE"), nullable=True)
    mistake_type = Column(String, nullable=False)
    lesson = Column(String, nullable=False)
    weight_change = Column(String, nullable=False) # e.g., "15% -> 12%"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class AgentWeightHistory(Base):
    """
    Full history of every weight change applied to every Agent.
    Enables Rollback when performance degrades.
    """
    __tablename__ = "agent_weight_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_name = Column(String, nullable=False, index=True)
    old_weight = Column(Float, nullable=False)
    new_weight = Column(Float, nullable=False)
    reason = Column(String, nullable=False)
    performance_score = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_agent_weight_history_agent_time", "agent_name", "created_at"),
    )

# ==========================================
# PHASE 12.6: DATA & MODEL VERSIONING
# ==========================================

class MarketDataSnapshot(Base):
    """
    Snapshots the exact state of market data used by the AI at decision time.
    Ensures full reproducibility and auditability.
    """
    __tablename__ = "market_data_snapshots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    decision_id = Column(UUID(as_uuid=True), ForeignKey("ai_logs.id", ondelete="CASCADE"), nullable=False, index=True)
    symbol = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    provider = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    indicator_version = Column(String, nullable=False)
    snapshot_data = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AgentVersion(Base):
    """
    Tracks versions of each agent for long-term improvement analysis.
    """
    __tablename__ = "agent_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_name = Column(String, nullable=False, index=True)
    version = Column(String, nullable=False)
    weight = Column(Float, nullable=False)
    performance_score = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("ix_agent_version_name_ver", "agent_name", "version", unique=True),
    )

# ==========================================
# PHASE 12.8: SECURITY & COMPLIANCE
# ==========================================

class AuditLog(Base):
    """
    Records every sensitive administrative action for compliance.
    """
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)
    details = Column(String, nullable=False)
    before_state = Column(String, nullable=True)
    after_state = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    admin = relationship("User")
