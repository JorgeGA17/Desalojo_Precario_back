from fastapi import Header, HTTPException, Depends, status
from app.core.security import decode_jwt
from app.infrastructure.security.cls_autenticacion import AutenticacionPg

async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split(" ", 1)[1]

    try:
        payload = decode_jwt(token)
        return {
            "username": payload["sub"],  
            "rol": payload["rol"]       
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def require_permission(endpoint: str):
    """
    Guard de autorización por rol + endpoint (no distingue método HTTP).
    """

    async def _checker(
        user = Depends(get_current_user),        
        auth: AutenticacionPg = Depends(AutenticacionPg.dep) 
    ):
   
        if user["rol"] == "SPREC_ADMIN":
            return user

        ok = await auth.tiene_permiso(user["rol"], endpoint)
        if not ok:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permiso denegado"
            )
        
        return user

    return _checker