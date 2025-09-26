from typing import List, Dict, Any, AsyncIterator
from fastapi import Request
from app.domain.ports.output.repositorio_port import RepositorioDocsPort

class PgRepoDocs(RepositorioDocsPort):
    def __init__(self, conn): self.conn = conn

    @staticmethod
    async def dep(request: Request) -> AsyncIterator["PgRepoDocs"]:
        async with request.app.state.pg_pool.acquire() as conn:
            yield PgRepoDocs(conn)

    async def listar_bandeja(self) -> List[Dict[str, Any]]:
        rows = await self.conn.fetch("""
            SELECT 1 AS expediente_id, 'EXP-001' AS codigo, 'En trámite' AS estado
        """)
        return [dict(r) for r in rows]