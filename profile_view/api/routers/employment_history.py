from fastapi import APIRouter
from api.schemas import EmploymentHistoryOut, EmploymentHistoryUpdate, EmploymentHistoryCreate
from api.crud.employment_history import employment_history_crud
from api.routers.base import generate_crud_router

router: APIRouter = generate_crud_router(
    prefix="/employment_history",
    tags=["employment_history"],
    schema_out=EmploymentHistoryOut,
    schema_update=EmploymentHistoryUpdate,
    schema_create=EmploymentHistoryCreate,
    crud_instance=employment_history_crud,
)
