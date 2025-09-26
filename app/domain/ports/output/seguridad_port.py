from typing import Protocol, Optional

class SeguridadPort(Protocol):

    async def validar_credenciales(self, username: str, password: str) -> Optional[str]:
        """Devuelve c_rol si las credenciales son válidas; None en caso contrario."""
        ...

    async def tiene_permiso(self, c_rol: str, endpoint: str) -> bool:
        """True si el rol tiene el endpoint activo en seguridad.mae_operacion."""
        ...
