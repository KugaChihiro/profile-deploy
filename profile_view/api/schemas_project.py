from pydantic import BaseModel
from typing import List, Optional, Any


class TeamMemberOut(BaseModel):
    id: int
    project_id: int
    member_name: str
    role_title: Optional[str] = None

    class Config:
        orm_mode = True


class ProjectOut(BaseModel):
    id: int  # 主キーはid
    name: str
    start_date: Optional[str] = None  # 文字列型
    end_date: Optional[str] = None    # 文字列型
    industry_categories: Optional[Any] = None  # JSON型
    type_categories: Optional[Any] = None      # JSON型

    class Config:
        orm_mode = True


class ProjectMemberResponse(BaseModel):
    project_id: int
    member_names: str  # カンマ区切りの文字列


class ProjectListResponse(BaseModel):
    projects: List[ProjectOut]