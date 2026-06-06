from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Pydantic buscará estas variables exactas (en mayúsculas o minúsculas) en el archivo .env
    abuseipdb_api_key: str
    otx_api_key: str
    urlhaus_api_key: str  # agregar esta línea

    # Apunta al contenedor redis_cache en la red threatguard-net
    redis_url: str = "redis://redis_cache:6379"
    cache_ttl_seconds: int = 1800

    jwt_secret: str
    jwt_algorithm: str = "HS256"

    # 👉 Configuración moderna para Pydantic v2
    # Le indica a la app que busque el archivo '.env' y que ignore variables extra si las hay
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()