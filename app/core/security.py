from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from typing import Dict
from app.core.jwt_utils import decode_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verificar_token(token: str) -> Dict:
    try:
        payload = decode_jwt(token)
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = verificar_token(token)
    return {
        "sub": payload.get("sub"),
        "rol": payload.get("rol"),
        "codigo": payload.get("codigo"),  # opcional si tu token lo trae
    }
