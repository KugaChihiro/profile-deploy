from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.database import get_db
from api.models import Employee
from api.schemas import EmployeeOut
from api.crud.base import CRUDBase

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
