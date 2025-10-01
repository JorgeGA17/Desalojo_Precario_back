from typing import Dict, Any, Optional
from abc import ABC, abstractmethod

class RepositorioUsuarioPort(ABC):
    @abstractmethod
    async def obtener_usuario(self, codigo: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def actualizar_usuario(self, codigo: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass
