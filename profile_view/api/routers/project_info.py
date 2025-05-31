from fastapi import APIRouter
from api.schemas import ProjectInfoOut, ProjectInfoUpdate, ProjectInfoCreate
from api.crud.project_info import project_info_crud
from api.routers.base import generate_crud_router

router: APIRouter = generate_crud_router(
    prefix="/project_info",
    tags=["project_info"],
    schema_out=ProjectInfoOut,
    schema_update=ProjectInfoUpdate,
    schema_create=ProjectInfoCreate,
    crud_instance=project_info_crud,
)