from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    # 🔑 JWT
    JWT_SECRET: str = Field("change_me")
    JWT_ALG: str = Field("HS256")
    JWT_EXP_MIN: int = Field(120)

    # 🐘 Seguridad
    PG_HOST: str = Field("127.0.0.1")
    PG_PORT: int = Field(5432)
    PG_DB: str = Field("seguridad")
    PG_USER: str = Field("postgres")
    PG_PASS: str = Field("postgres")

    # 🐘 Negocio
    PG_NEGOCIO_HOST: str = Field("127.0.0.1")
    PG_NEGOCIO_PORT: int = Field(5432)
    PG_NEGOCIO_DB: str = Field("Precario_negocio")
    PG_NEGOCIO_USER: str = Field("postgres")
    PG_NEGOCIO_PASS: str = Field("postgres")


settings = Settings()