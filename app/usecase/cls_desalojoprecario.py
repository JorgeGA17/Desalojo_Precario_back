# ============================================================
# === Capa: Aplicación (caso de uso Generar) ================
# ============================================================

from typing import Dict, Any
from app.domain.ports.input.generar_port import GenerarPort

# ------------------------------------------------------------
# Caso de uso: GenerarUseCase
# ------------------------------------------------------------
# - Implementa el puerto de entrada GenerarPort (contrato del dominio).
# - Se encarga de la lógica de negocio asociada a la "acción de generar"
#   un documento judicial (ej: autos, resoluciones, oficios).
# - Es el punto central donde se orquesta el flujo con otros servicios
#   o adaptadores secundarios (OCR, repositorios, plantillas).
# ------------------------------------------------------------
class GenerarUseCase(GenerarPort):

    # --------------------------------------------------------
    # Método: generar
    # --------------------------------------------------------
    # - Implementa el contrato definido en GenerarPort.
    # - Recibe un diccionario con datos necesarios para la
    #   generación (ej: expediente, tipo de documento, usuario).
    # - Devuelve un diccionario con el resultado del proceso.
    #
    # 🔹 Estado actual:
    #   Devuelve una respuesta simulada (mock), útil para pruebas
    #   iniciales sin depender aún de OCR, BD o plantillas reales.
    #
    # 🔹 Futuro:
    #   Aquí se integrará la orquestación real con:
    #     • Motor OCR → para extraer texto si aplica.
    #     • Plantillas → generar resoluciones/formatos en PDF.
    #     • Persistencia → guardar documento generado en BD/Storage.
    # --------------------------------------------------------
    async def generar(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # Simulación de la generación de documento
        return {
            "ok": True,                   # Indica éxito
            "documento_id": "DOC-001",    # ID ficticio del documento generado
            "payload": data               # Devuelve la data de entrada como eco
        }

