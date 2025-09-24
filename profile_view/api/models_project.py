from sqlalchemy import Column, String, Integer, JSON
from .database_project import ProjectBase


class TeamMember(ProjectBase):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, nullable=False)
    member_name = Column(String(100), nullable=False)
    role_title = Column(String(100))
    email = Column(String(200))
    phone = Column(String(50))
    sort_order = Column(Integer)
    is_active = Column(Integer)  # BIT型はIntegerで扱う


class Project(ProjectBase):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)  # 主キーはid
    code = Column(String(50))
    name = Column(String(200), nullable=False)
    start_date = Column(String(50))  # NVARCHAR(50)
    end_date = Column(String(50))    # NVARCHAR(50)
    channel = Column(String(500))
    folder = Column(String(500))
    client_name = Column(String(200))
    client_partner = Column(String(200))
    revenue = Column(String(200))
    industry_categories = Column(JSON)  # JSON型
    type_categories = Column(JSON)      # JSON型