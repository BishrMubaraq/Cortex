"""Application configuration.

Settings are loaded from environment variables (and an optional `.env` file).
Sensible defaults are provided so the boilerplate runs out of the box without
any setup. See `.env.example` for the full list of options.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- App metadata ---
    APP_NAME: str = "AI Research Assistant API"
    API_DESCRIPTION: str = "Boilerplate backend: hardcoded auth + mock data."

    # --- JWT / security ---
    SECRET_KEY: str = "change-me-in-production-super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # --- Hardcoded single demo user (no database) ---
    DEMO_USER_ID: str = "usr_admin_001"
    DEMO_USERNAME: str = "admin"
    DEMO_NAME: str = "Admin User"
    # Bcrypt hash for the password "password" (override via env in real use).
    DEMO_PASSWORD_HASH: str = (
        "$2b$12$xg4XQ2FUYi7Dy202jTcxAe8Erz4NgrjcfYpXdbtC2HenMxuveHN4a"
    )

    # --- CORS ---
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # --- LLM providers (plain streaming chat; no RAG/agents yet) ---
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    # Concrete model ids the UI's model dropdown maps onto.
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-latest"
    OPENAI_MODEL: str = "gpt-4o"
    # Generation limits / behaviour.
    LLM_MAX_TOKENS: int = 1024
    LLM_SYSTEM_PROMPT: str = (
        "You are a concise, helpful AI research assistant. Answer clearly and "
        "accurately. If you are unsure, say so."
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
