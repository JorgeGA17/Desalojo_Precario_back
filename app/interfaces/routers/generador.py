# ============================================================
# === Capa: Interfaces primarias (router FastAPI - Generar) ==
# ============================================================

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.deps import require_permission
from app.usecase.cls_desalojoprecario import GenerarUseCase

# ------------------------------------------------------------
# Definición del router
# ------------------------------------------------------------
# - Este router agrupa los endpoints relacionados con el
#   caso de uso "Generar" (documentos de desalojo precario).
# ------------------------------------------------------------
router = APIRouter()

# Constante que representa el endpoint a validar en seguridad.mae_operacion
# - Se pasa a require_permission() para verificar que el rol del usuario
#   tenga acceso habilitado en la base de datos de seguridad.
ENDPOINT = "/sisprecario-api/generador/procesar"

# ------------------------------------------------------------
# Modelo de request: GenerarReq
# ------------------------------------------------------------
# - Define la estructura de datos que el cliente debe enviar
#   en el cuerpo de la petición POST /generador/procesar.
# - Incluye:
#     • expediente_id: identificador numérico del expediente.
#     • parametros: diccionario con parámetros adicionales
#       (ej: tipo de documento, variables de plantilla, etc.).
# - Pydantic valida automáticamente que la data cumpla con
#   esta estructura antes de llegar al endpoint.
# ------------------------------------------------------------
class GenerarReq(BaseModel):
    expediente_id: int
    parametros: dict

# ------------------------------------------------------------
# Endpoint: POST /generador/procesar
# ------------------------------------------------------------
# - Expone el caso de uso GenerarUseCase a través de FastAPI.
# - Flujo:
#   1. require_permission(ENDPOINT) → valida que el usuario tenga
#      permiso en la tabla seguridad.mae_operacion.
#   2. Recibe los datos del request y los valida con Pydantic.
#   3. Crea una instancia del caso de uso GenerarUseCase.
#   4. Llama a uc.generar() pasando el diccionario validado.
#   5. Devuelve la respuesta generada por el caso de uso.
#
# - req.model_dump(): convierte el objeto Pydantic en un dict
#   estándar de Python (más seguro que usar .__dict__).
# ------------------------------------------------------------
@router.post("/generador/procesar")
async def generar_doc(
    req: GenerarReq,                              # Request body con expediente y parámetros
    user = Depends(require_permission(ENDPOINT))  # Validación de permisos por rol
):
    # Instancia del caso de uso Generar
    uc = GenerarUseCase()

    # Ejecuta la lógica del caso de uso y devuelve la respuesta
    return await uc.generar(req.model_dump())
