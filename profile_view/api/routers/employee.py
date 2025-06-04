from fastapi import APIRouter
from api.schemas import EmployeeOut, EmployeeUpdate, EmployeeUpdate
from api.crud.employees import employee_crud
from api.routers.base import generate_crud_router

router: APIRouter = generate_crud_router(
    prefix="/employees",
    tags=["employees"],
    schema_out=EmployeeOut,
    schema_update=EmployeeUpdate,
    schema_create=EmployeeUpdate,
    crud_instance=employee_crud,
)
