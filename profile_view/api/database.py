from .models import Base
from typing import Generator

# データベース接続URL
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user:password@localhost/dbname"

# エンジンの作成
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"charset": "utf8mb4"})

# セッションの作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# データベース接続用の依存関数
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()