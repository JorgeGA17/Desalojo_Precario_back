from typing import Protocol, List, Dict, Any

class BandejaPort(Protocol):

    async def listar(self) -> List[Dict[str, Any]]:
        ...
