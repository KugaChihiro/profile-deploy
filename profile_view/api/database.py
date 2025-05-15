from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# docker-composeで db というサービス名を使っている場合
DATABASE_URL = "mysql+aiomysql://root:tqy2250@db:3306/db-profile-dev-010?charset=utf8mb4"

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
