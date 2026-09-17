import uuid
from datetime import datetime
from app.database.session import SessionLocal
from app.models.base import User, Stock, MarketData
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    
    try:
        # Seed Demo User
        if not db.query(User).filter(User.email == "demo@laoai.com").first():
            demo_user = User(
                email="demo@laoai.com",
                password_hash=get_password_hash("password123"),
                risk_level="LOW"
            )
            db.add(demo_user)
            
        # Seed Stocks
        stocks = [
            {"id": "btc_usdt", "symbol": "BTC/USDT", "name": "Bitcoin", "market": "CRYPTO", "sector": "Layer 1"},
            {"id": "eth_usdt", "symbol": "ETH/USDT", "name": "Ethereum", "market": "CRYPTO", "sector": "Layer 1"},
            {"id": "aapl", "symbol": "AAPL", "name": "Apple Inc", "market": "STOCK", "sector": "Tech"}
        ]
        
        for stock_data in stocks:
            if not db.query(Stock).filter(Stock.id == stock_data["id"]).first():
                stock = Stock(**stock_data)
                db.add(stock)
                
                # Add one mock MarketData point for it
                market_data = MarketData(
                    stock_id=stock.id,
                    timestamp=datetime.utcnow(),
                    open=100.0,
                    high=105.0,
                    low=98.0,
                    close=102.0,
                    volume=1500.0
                )
                db.add(market_data)
                
        db.commit()
        print("Database seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
