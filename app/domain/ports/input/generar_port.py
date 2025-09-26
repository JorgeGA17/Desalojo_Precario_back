from typing import Protocol, Dict, Any

class GenerarPort(Protocol):

    async def generar(self, data: Dict[str, Any]) -> Dict[str, Any]:
        ...

        ...
