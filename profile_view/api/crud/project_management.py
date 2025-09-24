from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text
from typing import List, Dict
from ..models_project import Project


async def get_team_members_by_name(
    db: AsyncSession,
    member_name: str
) -> List[Dict]:
    """
    指定された名前のチームメンバーを含むプロジェクトIDと
    そのプロジェクトのメンバー名一覧を取得
    """
    query = text("""
        SELECT
            tm.project_id,
            STRING_AGG(tm.member_name, ',') as member_names
        FROM team_members tm
        WHERE tm.project_id IN (
            SELECT DISTINCT project_id
            FROM team_members
            WHERE member_name LIKE :member_name
        )
        GROUP BY tm.project_id
        ORDER BY tm.project_id
    """)

    result = await db.execute(query, {"member_name": f"%{member_name}%"})
    return [{"project_id": row.project_id, "member_names": row.member_names}
            for row in result.fetchall()]


async def get_projects_by_ids(
    db: AsyncSession,
    project_ids: List[int]
) -> List[Project]:
    """
    指定されたプロジェクトIDのリストに基づいてプロジェクト情報を取得
    """
    if not project_ids:
        return []

    query = select(Project).where(Project.id.in_(project_ids))
    result = await db.execute(query)
    return result.scalars().all()