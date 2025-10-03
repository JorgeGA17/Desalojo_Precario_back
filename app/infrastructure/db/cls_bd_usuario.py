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
            row = await self.conn.fetchrow("""
                SELECT c_codigo, x_usuario, x_nombre, x_email, c_distrito
                FROM negocios.maeusuario
                WHERE c_codigo = $1
            """, codigo)
            return dict(row) if row else None
        except Exception as e:
            print("❌ Error en obtener_usuario:", e)
            raise

    async def obtener_usuario_por_username(self, username: str) -> Optional[Dict[str, Any]]:
        try:
            row = await self.conn.fetchrow("""
                SELECT c_codigo, x_usuario, x_nombre, x_email, c_distrito
                FROM negocios.maeusuario
                WHERE x_usuario = $1
            """, username)
            return dict(row) if row else None
        except Exception as e:
            print("❌ Error en obtener_usuario_por_username:", e)
            raise

    # 👉 implementa el método exigido por la interfaz
    async def actualizar_usuario(self, codigo: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            row = await self.conn.fetchrow("""
                UPDATE negocios.maeusuario
                SET x_nombre = $1, x_email = $2
                WHERE c_codigo = $3
                RETURNING c_codigo, x_usuario, x_nombre, x_email, c_distrito
            """, data.get("x_nombre"), data.get("x_email"), codigo)
            return dict(row) if row else None
        except Exception as e:
            print("❌ Error en actualizar_usuario:", e)
            raise

    # 👉 método específico para tu endpoint PUT /me
    async def actualizar_mi_usuario(self, username: str, fullName: str, email: str):
        try:
            row = await self.conn.fetchrow("""
                UPDATE negocios.maeusuario
                SET x_nombre = $1, x_email = $2
                WHERE x_usuario = $3
                RETURNING c_codigo, x_usuario, x_nombre, x_email, c_distrito
            """, fullName, email, username)
            return dict(row) if row else None
        except Exception as e:
            print("❌ Error en actualizar_mi_usuario:", e)
            raise

    async def cambiar_password(self, username: str, oldPassword: str, newPassword: str):
        try:
            user = await self.conn.fetchrow("""
                SELECT c_codigo, x_clave FROM negocios.maeusuario WHERE x_usuario = $1
            """, username)

            if not user or user["x_clave"] != oldPassword:  # ⚠️ en prod usar hash seguro
                return None  

            row = await self.conn.fetchrow("""
                UPDATE negocios.maeusuario
                SET x_clave = $1
                WHERE x_usuario = $2
                RETURNING c_codigo, x_usuario
            """, newPassword, username)

            return dict(row) if row else None
        except Exception as e:
            print("❌ Error en cambiar_password:", e)
            raise
