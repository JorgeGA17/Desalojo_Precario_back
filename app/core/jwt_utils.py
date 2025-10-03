from datetime import datetime, timedelta, timezone
import jwt
from jose import JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings


# ============================================================
# Función: create_jwt
# - Genera un JWT con usuario, rol y tiempo de expiración.
# ============================================================
def create_jwt(sub: str, c_rol: str, extra: dict | None = None) -> str:
    payload = {
        "sub": sub,    # usuario
        "rol": c_rol,  # rol
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXP_MIN),
    }

    if extra:
        payload.update(extra)

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)


# ============================================================
# Función: decode_jwt
# - Decodifica un JWT validando firma y expiración.
# ============================================================
def decode_jwt(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])


# ============================================================
# Función: get_current_user
# - Se usa como dependencia en endpoints.
# - Extrae username y rol desde el JWT.
# ============================================================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token)
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"username": username, "rol": payload.get("rol")}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
