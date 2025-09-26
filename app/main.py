from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware   # 👈 CORS
from contextlib import asynccontextmanager
import asyncpg
from app.core.config import settings
from app.interfaces.routers import auth, bandeja, generador

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.pg_pool = await asyncpg.create_pool(
        host=settings.PG_HOST, 
        port=settings.PG_PORT,
        user=settings.PG_USER, 
        password=settings.PG_PASS,
        database=settings.PG_DB, 
        min_size=1, 
        max_size=10,
    )
    print("=== Pool PostgreSQL creado ===")
    yield
    await app.state.pg_pool.close()
    print("=== Pool PostgreSQL cerrado ===")

app = FastAPI(title="SISPRECARIO API", version="1.0.0", lifespan=lifespan)

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

app.include_router(auth.router,      prefix="/sisprecario-api/authenticate", tags=["auth"])
app.include_router(bandeja.router,   prefix="/sisprecario-api",              tags=["bandeja"])
app.include_router(generador.router, prefix="/sisprecario-api",              tags=["generador"])

@app.get("/ping")
def ping(): 
    return {"ok": True}

