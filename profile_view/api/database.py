from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import urllib.parse
from dotenv import load_dotenv
load_dotenv()

# docker-composeで db というサービス名を使っている場合
# DATABASE_URL = "mysql+aiomysql://root:tqy2250@db:3306/db-profile-dev-010?charset=utf8mb4"
# 環境変数から接続情報取得

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = urllib.parse.quote_plus(os.getenv("DB_PASSWORD", ""))
DB_NAME = os.getenv("DB_NAME")

# SQL Server 用の接続URLを構築
DATABASE_URL = (
    f"mssql+aioodbc://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    "?driver=ODBC+Driver+18+for+SQL+Server&encrypt=yes&trust_server_certificate=yes"
)

# 非同期エンジンの作成
engine = create_async_engine(DATABASE_URL, echo=True)

# 非同期セッションのファクトリ
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# モデル用の Base クラス（継承元）
Base = declarative_base()

# FastAPI の依存関係でセッションを提供する関数
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
