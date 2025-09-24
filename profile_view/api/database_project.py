from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

# プロジェクトデータベース用の接続設定
PROJECT_DB_HOST = os.getenv("PROJECT_DB_HOST", "localhost")
PROJECT_DB_PORT = os.getenv("PROJECT_DB_PORT", "1433")
PROJECT_DB_USER = os.getenv("PROJECT_DB_USER", "sa")
PROJECT_DB_PASSWORD = urllib.parse.quote_plus(
    os.getenv("PROJECT_DB_PASSWORD", ""))
PROJECT_DB_NAME = os.getenv(
    "PROJECT_DB_NAME", "db-project-management-dev-01")

# プロジェクトデータベース用の接続URLを構築
PROJECT_DATABASE_URL = (
    f"mssql+aioodbc://{PROJECT_DB_USER}:{PROJECT_DB_PASSWORD}@"
    f"{PROJECT_DB_HOST}:{PROJECT_DB_PORT}/{PROJECT_DB_NAME}"
    "?driver=ODBC+Driver+18+for+SQL+Server&encrypt=yes&"
    "trust_server_certificate=yes"
)

# プロジェクトデータベース用非同期エンジンの作成
project_engine = create_async_engine(PROJECT_DATABASE_URL, echo=True)

# プロジェクトデータベース用非同期セッションのファクトリ
AsyncProjectSessionLocal = sessionmaker(
    bind=project_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# プロジェクトデータベース用の Base クラス
ProjectBase = declarative_base()


# FastAPI の依存関係でプロジェクトデータベースセッションを提供する関数
async def get_project_db():
    async with AsyncProjectSessionLocal() as session:
        yield session