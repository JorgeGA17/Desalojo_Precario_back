import pyodbc
from typing import Iterable, Any, Optional, List, Dict
from app.core.config import load_db_config

# ======================================================================
# === CÓDIGO DRIVER
# ======================================================================
class _SybaseDriver:
    def __init__(self) -> None:
        """Inicializa el driver leyendo configs y preparando la conexión."""
        cfg = load_db_config("sybase")

        # Carga de las credenciales y el nombre del DSN desde el archivo de configuración.
        # la libreria pyodbc usará esta información para conectarse a la base de datos a través
        # del DSN registrado en el sistema operativo
        self._dsn = cfg.get("dsn")  
        self._user = cfg["user"]    
        self._password = cfg["password"]  
        self._conn: Optional[pyodbc.Connection] = None
        self._cursor: Optional[pyodbc.Cursor] = None

    def connect(self) -> None:
        """Conectar usando pyodbc y DSN."""
        if not self._conn:
            try:
                self._conn = pyodbc.connect(
                    f"DSN={self._dsn};UID={self._user};PWD={self._password}",
                    autocommit=True
                )
                self._cursor = self._conn.cursor()
                print("✅ Conexión exitosa vía ODBC DSN")
            except Exception as e:
                print(f"❌ Error al conectar: {e}")
                raise

    def query(self, sql: str, params: Iterable[Any] | None = None) -> List[Dict[str, Any]]:
        """Ejecuta una consulta SQL y devuelve los resultados."""
        self.connect()
        try:
            self._cursor.execute(sql, params or [])
            rows = self._cursor.fetchall()
            cols = [d[0] for d in self._cursor.description]
            return [dict(zip(cols, r)) for r in rows]
        finally:
            pass

# ======================================================================
# === CÓDIGO HEXAGONAL (adaptador secundario)
# ======================================================================
from app.domain.ports.output.repositorio_port import RepositorioDocsPort

class RepoDocsAnywhereAdapter(RepositorioDocsPort):
    """Adaptador secundario: implementa el contrato RepositorioDocsPort
    usando Sybase Anywhere como fuente de datos.
    """

    def __init__(self) -> None:
        # Inyecta el driver (_SybaseDriver) que maneja la conexión ODBC
        self.driver = _SybaseDriver()

    def listar(
        self, page: int, size: int, filtro: Optional[str]
    ) -> tuple[list[dict[str, Any]], int]:
        """Obtiene una página de expedientes aplicando filtro opcional."""

        # Construcción dinámica del WHERE
        where = "WHERE 1=1"
        params: list[Any] = []
        if filtro:
            where += " AND e.x_formato LIKE ?"
            params.append(f"%{filtro}%")

        # --- Total de registros (para paginación) ---
        total_sql = f"SELECT COUNT(*) AS total FROM expediente e {where}"
        total = (self.driver.query(total_sql, params) or [{"total": 0}])[0]["total"]

        # --- Paginación en SA11 (TOP + START AT en vez de OFFSET/FETCH) ---
        offset = (page - 1) * size
        start_at = offset + 1   # SA11 es 1-based, no 0-based
        top_n = size

        data_sql = f"""
            SELECT TOP {top_n} START AT {start_at}
                   e.id, e.x_formato AS expediente, e.pdf
            FROM expediente e
            {where}
            ORDER BY e.id
        """
        rows = self.driver.query(data_sql, params)

        # --- Mapeo a diccionarios para la capa de aplicación ---
        items = [
            {"id": r["id"], "expediente": r["expediente"], "pdf": r.get("pdf", "")}
            for r in rows
        ]
        return items, total
