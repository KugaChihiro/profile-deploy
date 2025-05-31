from fastapi import APIRouter
from api.schemas import PrivateInfoOut, PrivateInfoUpdate, PrivateInfoCreate
from api.crud.private_info import private_info_crud
from api.routers.base import generate_crud_router

router: APIRouter = generate_crud_router(
    prefix="/private_info",
    tags=["private_info"],
    schema_out=PrivateInfoOut,
    schema_update=PrivateInfoUpdate,
    schema_create=PrivateInfoCreate,
    crud_instance=private_info_crud,
)