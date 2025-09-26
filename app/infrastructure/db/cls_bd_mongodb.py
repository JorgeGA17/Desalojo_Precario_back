"""Logs/consultas en MongoDB (stub)."""

class MongoLogsAdapter:
    def __init__(self, uri: str = "mongodb://localhost:27017", dbname: str = "logs_sisprecario"):
        self.uri = uri
        self.dbname = dbname

    def guardar_evento(self, evento: dict) -> dict:
        """TODO: insert_one(evento)."""
        return {"ok": True}

    def buscar_eventos(self, filtro: dict | None = None, limit: int = 50) -> list[dict]:
        """TODO: find(filtro).limit(limit)."""
        return []

