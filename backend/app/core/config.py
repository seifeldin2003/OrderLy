import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from dotenv import load_dotenv

ENV_FILE = os.path.join(os.path.dirname(__file__), "../../.env")
load_dotenv(ENV_FILE, override=os.getenv("COS_SKIP_DOTENV_OVERRIDE") != "1")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Customer Ordering System"
    DATABASE_URL: str = "sqlite:///./customer_ordering.db"  # Default to SQLite
    JWT_SECRET_KEY: str = "change_this_secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    FRONTEND_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        case_sensitive=True
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.FRONTEND_ORIGINS.split(",")]

# 2. Add this special comment to tell VS Code to stop complaining about the red line
settings = Settings()  # type: ignore
