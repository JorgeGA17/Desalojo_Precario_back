# Capa: Aplicación (caso de uso Bandeja)
# ============================================================
# === Capa: Aplicación (caso de uso Bandeja) ================
# ============================================================

from typing import List, Dict, Any
from app.domain.ports.input.bandeja_port import BandejaPort
from app.domain.ports.output.repositorio_port import RepositorioDocsPort

# ------------------------------------------------------------
# Caso de uso: BandejaUseCase
# ------------------------------------------------------------
# - Implementa el puerto de entrada BandejaPort (contrato del dominio).
# - Orquesta la lógica de negocio relacionada a la "bandeja".
# - Depende de un puerto de salida RepositorioDocsPort para acceder
#   a los datos (infraestructura concreta: PostgreSQL, etc.).
# ------------------------------------------------------------
class BandejaUseCase(BandejaPort):

    # --------------------------------------------------------
    # Constructor
    # --------------------------------------------------------
    # - Recibe un repositorio que implementa RepositorioDocsPort.
    # - Inyección de dependencias → permite cambiar la fuente de
    #   datos (ej: PostgreSQL, mock en memoria, API externa).
    # --------------------------------------------------------
    def __init__(self, repo: RepositorioDocsPort):
        self.repo = repo

    # --------------------------------------------------------
    # Método: listar
    # --------------------------------------------------------
    # - Implementa el contrato de BandejaPort.
    # - Aquí se podrían aplicar reglas de negocio adicionales
    #   (ej: filtrar, transformar, auditar).
    # - Finalmente delega en el puerto de salida repo.listar_bandeja()
    #   para obtener los documentos.
    # --------------------------------------------------------
    async def listar(self) -> List[Dict[str, Any]]:
        # Orquesta reglas de negocio (si las hubiera) y llama al puerto de salida
        return await self.repo.listar_bandeja()

