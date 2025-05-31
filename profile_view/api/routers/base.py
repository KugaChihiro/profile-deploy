from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Type
from pydantic import BaseModel
from api.database import get_db


def generate_crud_router(
    *,
    prefix: str,
    tags: list[str],
    schema_out: Type[BaseModel],
    schema_update: Type[BaseModel],
    crud_instance,
    schema_create: Type[BaseModel] | None = None,
):
    router = APIRouter(prefix=prefix, tags=tags)

    # GET / → 全件取得
    @router.get("/", response_model=list[schema_out])
    async def read_all(db: AsyncSession = Depends(get_db)):
        return await crud_instance.get_all(db)

    # GET /{id} → 単一取得
    @router.get("/{id}", response_model=schema_out)
    async def read_one(id: int, db: AsyncSession = Depends(get_db)):
        item = await crud_instance.get(db, "id", id)
        if not item:
            raise HTTPException(status_code=404, detail=f"{prefix.strip('/').capitalize()} not found")
        return item

    # POST / → 作成（schema_createが指定されている場合は必ず作成）
    if schema_create is not None:
        @router.post("/", response_model=schema_out)
        async def create(item: schema_create, db: AsyncSession = Depends(get_db)):
            return await crud_instance.create(db, item.dict())

    # PUT /{id} → 更新
    @router.put("/{id}", response_model=schema_out)
    async def update(id: int, update: schema_update, db: AsyncSession = Depends(get_db)):
        updated = await crud_instance.update(db, "id", id, update.dict(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=404, detail=f"{prefix.strip('/').capitalize()} not found")
        return updated

    # DELETE /{id} → 削除（常に有効）
    @router.delete("/{id}")
    async def delete(id: int, db: AsyncSession = Depends(get_db)):
        success = await crud_instance.delete(db, "id", id)
        if not success:
            raise HTTPException(status_code=404, detail=f"{prefix.strip('/').capitalize()} not found")
        return {"detail": f"{prefix.strip('/').capitalize()} deleted"}

    return router