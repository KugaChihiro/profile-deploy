"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Type

from database import get_db
from crud.base import CRUDBase


def generate_crud_router(
    *,
    prefix: str,
    tags: list[str],
    schema_create: Type,
    schema_update: Type,
    schema_out: Type,
    crud_instance: CRUDBase,
    id_field: str
) -> APIRouter:
    router = APIRouter(prefix=prefix, tags=tags)

    @router.get("/", response_model=list[schema_out])
    async def read_all(db: AsyncSession = Depends(get_db)):
        return await crud_instance.get_all(db)

    @router.get("/{item_id}", response_model=schema_out)
    async def read_one(item_id: int, db: AsyncSession = Depends(get_db)):
        item = await crud_instance.get(db, id_field, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item

    @router.post("/", response_model=schema_out)
    async def create(item: schema_create, db: AsyncSession = Depends(get_db)):
        return await crud_instance.create(db, item.dict())

    @router.put("/{item_id}", response_model=schema_out)
    async def update(item_id: int, item: schema_update, db: AsyncSession = Depends(get_db)):
        updated = await crud_instance.update(db, id_field, item_id, item.dict(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=404, detail="Item not found")
        return updated

    @router.delete("/{item_id}")
    async def delete(item_id: int, db: AsyncSession = Depends(get_db)):
        success = await crud_instance.delete(db, id_field, item_id)
        if not success:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"detail": "Item deleted"}

    return router
"""