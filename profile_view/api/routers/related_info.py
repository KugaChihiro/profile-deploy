from fastapi import APIRouter
from api.schemas import RelatedInfoOut, RelatedInfoUpdate, RelatedInfoCreate
from api.crud.related_info import related_info_crud
from api.routers.base import generate_crud_router

router: APIRouter = generate_crud_router(
    prefix="/related_info",
    tags=["related_info"],
    schema_out=RelatedInfoOut,
    schema_update=RelatedInfoUpdate,
    schema_create=RelatedInfoCreate,
    crud_instance=related_info_crud,
)