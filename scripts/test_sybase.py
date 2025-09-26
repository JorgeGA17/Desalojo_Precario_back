"""
Script auxiliar para probar conexión a Sybase fuera de FastAPI.
No forma parte de la arquitectura hexagonal.
"""

from pathlib import Path
import sys

# Añade la raíz del proyecto al sys.path para que 'app' sea importable
ROOT = Path(__file__).resolve().parents[1]  # .../sisprecario_backend
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.infrastructure.db.cls_bd_anywhere import _SybaseDriver

def main():
    drv = _SybaseDriver()
    rows = drv.query("SELECT TOP 1 1 AS ok")
    print("Resultado de prueba:", rows)

if __name__ == "__main__":
    main()