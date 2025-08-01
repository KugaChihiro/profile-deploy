from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from api.schemas import RelatedInfoOut, RelatedInfoUpdate, RelatedInfoCreate
from api.database import get_db
from api.models import Employee
from api.schemas import EmployeeOut
from api.crud.base import CRUDBase
from api.crud.related_info import related_info_crud

router = APIRouter()
crud_employee = CRUDBase(Employee)

@router.put("/reset_image/{id}", response_model=EmployeeOut)
async def reset_image(id: int, db: AsyncSession = Depends(get_db)):
    # id（主キー）で該当レコード取得
    employee = await crud_employee.get(db, key_field="id", value=id)
    if not employee:
        raise HTTPException(status_code=404, detail="Image not found")

    # photo_url を NULL に更新
    updated = await crud_employee.update(
        db,
        key_field="id",
        value=id,
        obj_in={"photo_url": None}
    )
    return updated

@router.put("/reset_profile_thumbnail/{id}", response_model=RelatedInfoOut)
async def reset_profile_thumbnail(id: int, db: AsyncSession = Depends(get_db)):
    """
    プロフィール動画のサムネイルURLをリセット（NULLに更新）する。
    """
    # idをキーにして該当レコードを取得
    related_info = await related_info_crud.get(db, key_field="id", value=id)
    if not related_info:
        raise HTTPException(status_code=404, detail="Related info not found")

    # profile_thumbnail_url を NULL に更新
    updated = await related_info_crud.update(
        db,
        key_field="id",
        value=id,
        obj_in={"profile_thumbnail_url": None}
    )
    return updated

@router.put("/reset_seminar_thumbnail/{id}", response_model=RelatedInfoOut)
async def reset_seminar_thumbnail(
    id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    特定のセミナー動画のサムネイルURLをリセット（空文字に更新）する。
    """

    # idをキーにして該当レコードを取得
    related_info = await related_info_crud.get(db, key_field="id", value=id)
    if not related_info:
        raise HTTPException(status_code=404, detail="Related info not found")

    # seminar_thumbnail_url を NULL に更新
    updated = await related_info_crud.update(
        db,
        key_field="id",
        value=id,
        obj_in={"seminar_thumbnail_url": None}
    )
    return updated