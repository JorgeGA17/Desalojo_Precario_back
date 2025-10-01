from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware   # 👈 CORS
from contextlib import asynccontextmanager
import asyncpg
from app.core.config import settings
from app.interfaces.routers import auth, bandeja, generador, usuario   # 👈 agrega tu nuevo router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pool BD Seguridad
    app.state.pg_pool = await asyncpg.create_pool(
        host=settings.PG_HOST, 
        port=settings.PG_PORT,
        user=settings.PG_USER, 
        password=settings.PG_PASS,
        database=settings.PG_DB, 
        min_size=1, 
        max_size=10,
    )
    print("=== Pool PostgreSQL Seguridad creado ===")

    # Pool BD Negocio
    app.state.pg_pool_negocio = await asyncpg.create_pool(
        host=settings.PG_NEGOCIO_HOST, 
        port=settings.PG_NEGOCIO_PORT,
        user=settings.PG_NEGOCIO_USER, 
        password=settings.PG_NEGOCIO_PASS,
        database=settings.PG_NEGOCIO_DB, 
        min_size=1, 
        max_size=10,
    )
    print("=== Pool PostgreSQL Negocio creado ===")

    yield

    # Cerrar pools al apagar
    await app.state.pg_pool.close()
    await app.state.pg_pool_negocio.close()
    print("=== Pools PostgreSQL cerrados ===")

app = FastAPI(title="SISPRECARIO API", version="1.0.0", lifespan=lifespan)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router,      prefix="/sisprecario-api/authenticate", tags=["auth"])
app.include_router(bandeja.router,   prefix="/sisprecario-api",              tags=["bandeja"])
app.include_router(generador.router, prefix="/sisprecario-api",              tags=["generador"])
app.include_router(usuario.router,   prefix="/sisprecario-api",              tags=["usuario"])  # 👈 aquí tu nuevo endpoint

@app.get("/ping")
def ping(): 
    return {"ok": True}


