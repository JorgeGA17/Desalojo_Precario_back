from typing import Dict, Any, Optional, AsyncIterator
from fastapi import Request
from app.domain.ports.output.usuario_port import RepositorioUsuarioPort

class PgRepoUsuario(RepositorioUsuarioPort):
    def __init__(self, conn):
        self.conn = conn

    @staticmethod
    async def dep(request: Request) -> AsyncIterator["PgRepoUsuario"]:
        async with request.app.state.pg_pool_negocio.acquire() as conn:
            yield PgRepoUsuario(conn)

    async def obtener_usuario(self, codigo: int) -> Optional[Dict[str, Any]]:
        try:
            print(f"🔍 Ejecutando query con codigo={codigo}")   # LOG DEBUG
            row = await self.conn.fetchrow("""
                SELECT c_codigo, x_usuario, x_nombre, x_email, c_distrito
                FROM negocios.maeusuario
                WHERE c_codigo = $1
            """, codigo)
            print(f"✅ Resultado query: {row}")  # LOG DEBUG
            return dict(row) if row else None
        except Exception as e:
            print("❌ Error en obtener_usuario:", e)
            raise

    async def actualizar_usuario(self, codigo: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not data:
            return None

        try:
            set_clause = ", ".join([f"{k} = ${i+2}" for i, k in enumerate(data.keys())])
            values = [codigo] + list(data.values())

            print(f"📝 Ejecutando UPDATE usuario={codigo}, data={data}")  # LOG DEBUG

            row = await self.conn.fetchrow(f"""
                UPDATE negocios.maeusuario
                SET {set_clause}
                WHERE c_codigo = $1
                RETURNING c_codigo, x_usuario, x_nombre, x_email, c_distrito
            """, *values)

            print(f"✅ Resultado UPDATE: {row}")  # LOG DEBUG
            return dict(row) if row else None
        except Exception as e:
            print("❌ Error en actualizar_usuario:", e)
            raise
