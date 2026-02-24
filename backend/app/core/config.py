import os
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    # Prefer host env when running tools like alembic on Windows/macOS
    load_dotenv(".env.host")
    # Then load default .env (Docker / general local)
    load_dotenv()
except Exception:
    pass


class Settings(BaseModel):
    database_url: str = os.getenv("DATABASE_URL", "")
    jwt_secret: str = os.getenv("JWT_SECRET", "")
    jwt_algorithm: str = "HS256"
    access_token_exp_minutes: int = 60


settings = Settings()