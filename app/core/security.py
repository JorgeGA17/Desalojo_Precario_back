from datetime import datetime, timedelta, timezone 
import jwt
from app.core.config import settings

def create_jwt(sub: str, c_rol: str, extra: dict | None = None) -> str:
    payload = {
        "sub": sub,   
        "rol": c_rol, 
        "iat": datetime.now(timezone.utc), 
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXP_MIN),  
    }

    if extra:
        payload.update(extra)

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

def decode_jwt(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])