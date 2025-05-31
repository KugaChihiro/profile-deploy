from fastapi import APIRouter
from api.schemas import InsightInfoOut, InsightInfoUpdate, InsightInfoCreate
from api.crud.insight_info import insight_info_crud
from api.routers.base import generate_crud_router

router: APIRouter = generate_crud_router(
    prefix="/insight_info",
    tags=["insight_info"],
    schema_out=InsightInfoOut,
    schema_update=InsightInfoUpdate,
    schema_create=InsightInfoCreate,
    crud_instance=insight_info_crud,
)