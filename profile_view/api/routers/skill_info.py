from fastapi import APIRouter
from api.schemas import SkillInfoOut, SkillInfoUpdate, SkillInfoCreate
from api.crud.skill_info import skill_info_crud
from api.routers.base import generate_crud_router

router: APIRouter = generate_crud_router(
    prefix="/skill_info",
    tags=["skill_info"],
    schema_out=SkillInfoOut,
    schema_update=SkillInfoUpdate,
    schema_create=SkillInfoCreate,
    crud_instance=skill_info_crud,
)