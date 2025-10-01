from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.infrastructure.db.cls_bd_usuario import PgRepoUsuario

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

class UsuarioUpdate(BaseModel):
    x_nombre: str | None = None
    x_email: str | None = None
    c_distrito: int | None = None

@router.get("/{codigo}")
async def obtener_usuario(codigo: int, repo: PgRepoUsuario = Depends(PgRepoUsuario.dep)):
    print(f"📡 Endpoint /usuarios/{codigo} invocado")  # LOG DEBUG
    usuario = await repo.obtener_usuario(codigo)
    if not usuario:
        print("⚠️ Usuario no encontrado en DB")  # LOG DEBUG
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.put("/{codigo}")
async def actualizar_usuario(codigo: int, data: UsuarioUpdate, repo: PgRepoUsuario = Depends(PgRepoUsuario.dep)):
    usuario = await repo.actualizar_usuario(codigo, data.dict(exclude_unset=True))
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario
