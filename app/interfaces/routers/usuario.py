from fastapi import APIRouter, Depends, Request
from app.infrastructure.db.cls_bd_usuario import PgRepoUsuario
from app.interfaces.request.update_profile_request import UpdateProfileRequest
from app.interfaces.request.change_password_request import ChangePasswordRequest
from app.core.security import get_current_user  # ⚡ tu función de auth con JWT

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

# ✅ Perfil autenticado


@router.get("/me")
async def obtener_mi_perfil(
    current_user: dict = Depends(get_current_user),
    repo: PgRepoUsuario = Depends(PgRepoUsuario.dep)
):
    return await repo.obtener_usuario_por_username(current_user["sub"])

# ✏️ Actualizar perfil


@router.put("/me")
async def actualizar_mi_perfil(
    dto: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
    repo: PgRepoUsuario = Depends(PgRepoUsuario.dep)
):
    print("📥 Datos recibidos del frontend:",
          dto.dict())  # <-- Aquí ves qué llega
    print("Usuario autenticado:", current_user["sub"])

    usuario = await repo.actualizar_mi_usuario(current_user["sub"], dto.fullName, dto.email)
    if not usuario:
        return {"detail": "No se pudo actualizar el perfil"}
    return usuario

# 🔑 Cambiar contraseña


@router.post("/change-password")
async def cambiar_password(
    dto: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    repo: PgRepoUsuario = Depends(PgRepoUsuario.dep)
):
    usuario = await repo.cambiar_password(current_user["sub"], dto.oldPassword, dto.newPassword)
    if not usuario:
        return {"detail": "Contraseña incorrecta"}
    return {"message": "Contraseña actualizada con éxito"}
