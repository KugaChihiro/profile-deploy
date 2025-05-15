from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


class CRUDBase:
    """
    任意のSQLAlchemyモデルに対して共通のCRUD操作を提供するクラス。
    モデルを初期化時に渡して使う。
    """

    def __init__(self, model):
        # 例: model = Employee（SQLAlchemyのモデルクラス）
        self.model = model

    async def get(self, db: AsyncSession, key_field: str, value):
        """
        指定したフィールド（key_field）に一致する値（value）を持つ1件のデータを取得。
        """
        result = await db.execute(
            select(self.model).where(getattr(self.model, key_field) == value)
        )
        return result.scalars().first()

    async def get_all(self, db: AsyncSession):
        """
        全件のデータを取得。
        """
        result = await db.execute(select(self.model))
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_in: dict):
        """
        新しいデータを作成してDBに登録。
        obj_in は辞書形式のデータ（Pydanticモデル.dict()など）。
        """
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, key_field: str, value, obj_in: dict):
        """
        指定フィールドと値で該当する1件を探し、obj_in の内容で更新。
        該当なしの場合は None を返す。
        """
        result = await db.execute(
            select(self.model).where(getattr(self.model, key_field) == value)
        )
        db_obj = result.scalars().first()
        if not db_obj:
            return None

        for key, val in obj_in.items():
            setattr(db_obj, key, val)

        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, key_field: str, value):
        """
        指定フィールドと値で該当する1件を削除。
        成功時は True、見つからなければ False を返す。
        """
        result = await db.execute(
            select(self.model).where(getattr(self.model, key_field) == value)
        )
        db_obj = result.scalars().first()
        if not db_obj:
            return False

        await db.delete(db_obj)
        await db.commit()
        return True
