# app/interfaces/routers/auth.py
# Capa: Interfaces primarias (router FastAPI)
# ============================================================
# === Capa: Interfaces primarias (router FastAPI - Auth) =====
# ============================================================

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import create_jwt
from app.infrastructure.security.cls_autenticacion import AutenticacionPg

# ------------------------------------------------------------
# Definición del router
# ------------------------------------------------------------
# - Este router agrupa los endpoints relacionados con
#   autenticación y login de usuarios.
# ------------------------------------------------------------
router = APIRouter()

# ------------------------------------------------------------
# Modelo de request: LoginReq
# ------------------------------------------------------------
# - Define la estructura de datos que el cliente debe enviar
#   en el cuerpo de la petición POST /login.
# - Pydantic valida automáticamente que tenga `username` y `password`.
# ------------------------------------------------------------
class LoginReq(BaseModel):
    username: str
    password: str

# ------------------------------------------------------------
# Endpoint: POST /login
# ------------------------------------------------------------
# - Recibe credenciales (username + password).
# - Usa AutenticacionPg (adaptador de seguridad con PostgreSQL)
#   para validar las credenciales contra la BD.
# - Si son válidas:
#     • Genera un token JWT con el rol del usuario.
#     • Devuelve el token, el tipo (bearer) y el rol asignado.
# - Si no son válidas:
#     • Lanza un HTTP 401 Unauthorized.
# ------------------------------------------------------------
@router.post("/login")
async def login(
    req: LoginReq,                               # Datos del cuerpo (username + password)
    auth: AutenticacionPg = Depends(AutenticacionPg.dep)  # Inyección del adaptador de seguridad
):
    # Validar credenciales en PostgreSQL
    c_rol = await auth.validar_credenciales(req.username, req.password)

    # Si no existe rol → credenciales incorrectas
    if not c_rol:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # Retorna un token JWT firmado + info de rol
    return {
        "access_token": create_jwt(req.username, c_rol),  # JWT con usuario y rol
        "token_type": "bearer",                           # Tipo estándar en OAuth2
        "rol": c_rol                                      # Rol devuelto por la BD
    }