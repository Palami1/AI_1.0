import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import get_db

# Mock DB dependency for testing before DB is set up
def override_get_db():
    yield None

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_startup_and_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to LAO AI INVESTMENT OS API"}

def test_swagger_access():
    response = client.get("/api/v1/openapi.json")
    assert response.status_code == 200

def test_auth_login_success():
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "investor@laoai.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_auth_login_failure():
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "investor@laoai.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_user_api():
    response = client.get("/api/v1/users/me")
    assert response.status_code == 200
    assert "email" in response.json()

def test_market_api():
    response = client.get("/api/v1/market/stocks/BTC/USDT/price")
    assert response.status_code == 200
    assert response.json()["price"] == 65000

def test_ai_api():
    response = client.get("/api/v1/ai/report/BTC")
    assert response.status_code == 200
    assert response.json()["action"] == "WAIT"

def test_portfolio_api():
    response = client.get("/api/v1/portfolio/risk-summary")
    assert response.status_code == 200
    assert response.json()["riskExposure"] == "LOW"

def test_risk_api():
    response = client.post("/api/v1/risk/calculate-position?capital=10000&risk_tolerance=LOW")
    assert response.status_code == 200
    assert response.json()["recommendedSize"] == 200
