from typing import Protocol, List, Dict, Any

class RepositorioDocsPort(Protocol):

    async def listar_bandeja(self) -> List[Dict[str, Any]]:
        ...
