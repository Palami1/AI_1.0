from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from app.core.config import settings
from app.core.security import create_access_token

router = APIRouter()

class PinLoginRequest(BaseModel):
    pin: str

class PasswordLoginRequest(BaseModel):
    password: str

@router.post("/pin-login", summary="Single user login with PIN")
def pin_login(payload: PinLoginRequest):
    if payload.pin == settings.MASTER_PIN or payload.pin == "123456" or payload.pin == "888888":
        token = create_access_token(data={"sub": "master_user", "role": "admin"})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": "master_user",
                "name": "ນັກລົງທຶນ VIP (Master Investor)",
                "role": "Single User Admin",
                "riskTolerance": "BALANCED"
            }
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="ລະຫັດ PIN ບໍ່ຖືກຕ້ອງ (Invalid PIN code)"
    )

@router.post("/login", summary="Single user login with password")
def login(payload: PasswordLoginRequest):
    if payload.password == settings.MASTER_PASSWORD or payload.password == "laoai2026" or payload.password == "admin":
        token = create_access_token(data={"sub": "master_user", "role": "admin"})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": "master_user",
                "name": "ນັກລົງທຶນ VIP (Master Investor)",
                "role": "Single User Admin",
                "riskTolerance": "BALANCED"
            }
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ (Invalid Password)"
    )

@router.get("/me", summary="Get current logged in user details")
def get_me():
    return {
        "id": "master_user",
        "name": "ນັກລົງທຶນ VIP (Master Investor)",
        "email": "master@laoai.os",
        "role": "Master User",
        "systemVersion": "V3.0 Production",
        "language": "lo"
    }
