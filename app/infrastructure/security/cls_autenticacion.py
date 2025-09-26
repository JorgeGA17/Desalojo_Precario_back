import bcrypt
from typing import Optional, AsyncIterator
from fastapi import Request
from app.domain.ports.output.seguridad_port import SeguridadPort

class AutenticacionPg(SeguridadPort):
    def __init__(self, conn): self.conn = conn

    # ✅ FastAPI espera un generador async con yield (NO @asynccontextmanager)
    @staticmethod
    async def dep(request: Request) -> AsyncIterator["AutenticacionPg"]:
        async with request.app.state.pg_pool.acquire() as conn:
            yield AutenticacionPg(conn)

    async def validar_credenciales(self, username: str, password: str) -> Optional[str]:
        row = await self.conn.fetchrow("""
            SELECT u.c_clave, r.c_rol
              FROM seguridad.mae_usuario u
              JOIN seguridad.mae_rol_usuario ru ON ru.n_usuario = u.n_usuario AND ru.l_activo = '1'
              JOIN seguridad.mae_rol r          ON r.n_rol      = ru.n_rol
             WHERE u.c_usuario = $1
               AND u.l_activo  = '1'
             LIMIT 1
        """, username)
        if not row:
            return None
        db_hash, c_rol = row["c_clave"], row["c_rol"]
        try:
            ok = bcrypt.checkpw(password.encode("utf-8"), db_hash.encode("utf-8"))
        except Exception:
            return None
        return c_rol if ok else None

    async def tiene_permiso(self, c_rol: str, endpoint: str) -> bool:
        row = await self.conn.fetchrow("""
            SELECT 1
              FROM seguridad.mae_operacion mo
              JOIN seguridad.mae_aplicativo a ON a.n_aplicativo = mo.n_aplicativo
              JOIN seguridad.mae_rol r        ON r.n_rol        = mo.n_rol
             WHERE a.c_aplicativo = 'SPREC'
               AND r.c_rol        = $1
               AND mo.x_endpoint  = $2
               AND mo.l_activo    = '1'
             LIMIT 1
        """, c_rol, endpoint)
        return bool(row)
