import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from api.database import get_db
from api.schemas import EmployeeCreate, EmployeeUpdate, EmployeeOut
from api.crud.employees import employee_crud
# ★ storage.pyからヘルパー関数をインポート
from api.routers.storage import generate_read_sas_url

router = APIRouter(prefix="/employees", tags=["employees"])


# 全件取得（GET /employees）
@router.get("/", response_model=list[EmployeeOut])
async def read_employees(db: AsyncSession = Depends(get_db)):
    employees_from_db = await employee_crud.get_all(db)

    # ★★★★★ ここから修正 ★★★★★
    # 各従業員のphoto_urlをSAS付きURLに変換
    for employee in employees_from_db:
        if employee.photo_url:
            # DBに保存されたURLからファイル名のみを抽出
            blob_name = os.path.basename(employee.photo_url)
            # 読み取り用SAS付きURLを生成して上書き
            employee.photo_url = generate_read_sas_url(blob_name)
    # ★★★★★ ここまで修正 ★★★★★

    return employees_from_db


# 特定の社員情報を取得（GET /employees/{id}）
@router.get("/{id}", response_model=EmployeeOut)
async def read_employee(id: int, db: AsyncSession = Depends(get_db)):
    employee = await employee_crud.get(db, "id", id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # ★★★★★ ここから修正 ★★★★★
    # photo_urlが存在すれば、SAS付きURLに変換
    if employee.photo_url:
        blob_name = os.path.basename(employee.photo_url)
        employee.photo_url = generate_read_sas_url(blob_name)
    # ★★★★★ ここまで修正 ★★★★★

    return employee


# 新規作成（POST /employees）
@router.post("/", response_model=EmployeeOut)
async def create_employee(employee: EmployeeCreate, db: AsyncSession = Depends(get_db)):
    return await employee_crud.create(db, employee.dict())


# 更新（PUT /employees/{id}）
@router.put("/{id}", response_model=EmployeeOut)
async def update_employee(id: int, update: EmployeeUpdate, db: AsyncSession = Depends(get_db)):
    updated = await employee_crud.update(db, "id", id, update.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found")
    return updated


# 削除（DELETE /employees/{id}）
@router.delete("/{id}")
async def delete_employee(id: int, db: AsyncSession = Depends(get_db)):
    success = await employee_crud.delete(db, "id", id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"detail": "Employee deleted"}