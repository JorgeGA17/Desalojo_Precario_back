# Capa: Interfaces primarias (router FastAPI)
# ============================================================
# === Capa: Interfaces primarias (router FastAPI - Bandeja) ==
# ============================================================

from fastapi import APIRouter, Depends
from app.core.deps import require_permission
from app.infrastructure.db.cls_bd_postgres import PgRepoDocs
from app.usecase.cls_bandeja import BandejaUseCase

# ------------------------------------------------------------
# Definición del router
# ------------------------------------------------------------
# - Este router agrupa los endpoints relacionados con la
#   "bandeja" de documentos.
# ------------------------------------------------------------
router = APIRouter()

# Constante que representa el endpoint a validar en seguridad.mae_operacion
# - Se usa en require_permission() para verificar si el rol tiene acceso.
ENDPOINT = "/sisprecario-api/bandeja"

# ------------------------------------------------------------
# Endpoint: GET /bandeja
# ------------------------------------------------------------
# - Devuelve la lista de documentos en la bandeja.
# - Flujo:
#   1. require_permission(ENDPOINT) → valida que el usuario tenga permiso.
#   2. PgRepoDocs.dep → inyecta el repositorio conectado a PostgreSQL.
#   3. BandejaUseCase → orquesta la lógica del caso de uso.
#   4. Retorna la lista obtenida del repositorio (con posibles reglas de negocio).
# ------------------------------------------------------------
@router.get("/bandeja")
async def listar_bandeja(
    user = Depends(require_permission(ENDPOINT)),  # Valida rol/permiso para este endpoint
    repo = Depends(PgRepoDocs.dep)                 # Inyección del repositorio (adaptador secundario)
):
    # Se instancia el caso de uso, recibiendo el repositorio como dependencia
    uc = BandejaUseCase(repo)
    
    # Ejecuta la lógica del caso de uso y devuelve el resultado
    return await uc.listar()
