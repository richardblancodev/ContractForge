from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application configuration settings loaded from environment variables.
    """
    PROJECT_NAME: str = "Automated Contract & Document Generator API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # CORS origins allowed to communicate with the API.
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    ALLOWED_ORIGIN_REGEX: str = r"https://.*\.vercel\.app"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()