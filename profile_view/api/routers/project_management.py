from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database_project import get_project_db
from ..schemas_project import (
    ProjectMemberResponse,
    ProjectOut
)
from ..crud.project_management import (
    get_team_members_by_name,
    get_projects_by_ids
)

router = APIRouter(prefix="/project-management", tags=["project-management"])


@router.get("/team-members/{member_name}",
            response_model=List[ProjectMemberResponse])
async def get_team_members_by_member_name(
    member_name: str,
    db: AsyncSession = Depends(get_project_db)
):
    """
    指定されたメンバー名を含むプロジェクトの情報を取得
    """
    try:
        result = await get_team_members_by_name(db, member_name)
        return [ProjectMemberResponse(**item) for item in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/projects", response_model=List[ProjectOut])
async def get_projects_by_project_ids(
    project_ids: str,
    db: AsyncSession = Depends(get_project_db)
):
    """
    カンマ区切りのプロジェクトIDでプロジェクト情報を取得
    例: /projects?project_ids=1,2,3
    """
    try:
        # カンマ区切りの文字列をintのリストに変換
        project_id_list = [int(pid.strip()) for pid in project_ids.split(",")]
        projects = await get_projects_by_ids(db, project_id_list)
        return projects
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid project_ids format. Use comma-separated integers."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))