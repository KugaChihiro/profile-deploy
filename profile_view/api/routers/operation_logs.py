from fastapi import APIRouter
from api.schemas import OperationLogsOut, OperationLogsUpdate, OperationLogsCreate
from api.crud.operation_logs import operation_logs_crud
from api.routers.base import generate_crud_router

router: APIRouter = generate_crud_router(
    prefix="/operation_logs",
    tags=["operation_logs"],
    schema_out=OperationLogsOut,
    schema_update=OperationLogsUpdate,
    schema_create=OperationLogsCreate,
    crud_instance=operation_logs_crud,
)