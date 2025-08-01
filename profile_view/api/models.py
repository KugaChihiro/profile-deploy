from sqlalchemy import Column, Integer, Unicode, Date
from api.database import Base

class Employee(Base):
    __tablename__ = "employees"
    __table_args__ = {"schema": "dbo"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    name = Column(Unicode(100))
    kana = Column(Unicode(100))
    birthdate = Column(Date)
    hometown = Column(Unicode(100))
    elementary_school = Column(Unicode(100))
    junior_high_school = Column(Unicode(100))
    high_school = Column(Unicode(100))
    university = Column(Unicode(100))
    faculty = Column(Unicode(100))
    graduate_school = Column(Unicode(100))
    major = Column(Unicode(100))
    photo_url = Column(Unicode(500))



class EmploymentHistory(Base):
    __tablename__ = "employment_history"
    __table_args__ = {"schema": "dbo"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    company_name = Column(Unicode(100))
    job_title = Column(Unicode(100))
    start_date = Column(Unicode(100))
    end_date = Column(Unicode(100))
    description = Column(Unicode(500))
    knowledge = Column(Unicode(500))



class ProjectInfo(Base):
    __tablename__ = "project_info"
    __table_args__ = {"schema": "dbo"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    project = Column(Unicode(50))
    skill = Column(Unicode(500))
    comment = Column(Unicode(500))
    start_date = Column(Unicode(100))
    end_date = Column(Unicode(100))



class InsightInfo(Base):
    __tablename__ = "insight_info"
    __table_args__ = {"schema": "dbo"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    insight = Column(Unicode(50))
    skill = Column(Unicode(500))
    comment = Column(Unicode(500))



class SkillInfo(Base):
    __tablename__ = "skill_info"
    __table_args__ = {"schema": "dbo"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    skill = Column(Unicode(500))



class PrivateInfo(Base):
    __tablename__ = "private_info"
    __table_args__ = {"schema": "dbo"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    blood_type = Column(Unicode(50))
    nickname = Column(Unicode(100))
    mbti = Column(Unicode(50))
    family_structure = Column(Unicode(100))
    father_job = Column(Unicode(100))
    mother_job = Column(Unicode(100))
    lessons = Column(Unicode(500))
    club_activities = Column(Unicode(100))
    jobs = Column(Unicode(500))
    circles = Column(Unicode(100))
    hobbies = Column(Unicode(100))
    favorite_foods = Column(Unicode(100))
    disliked_foods = Column(Unicode(100))
    holiday_activities = Column(Unicode(100))
    favorite_celebrities = Column(Unicode(100))
    favorite_characters = Column(Unicode(100))
    favorite_artists = Column(Unicode(100))
    favorite_comedians = Column(Unicode(100))
    activities_free = Column(Unicode(500))
    favorite_things_free = Column(Unicode(500))



class RelatedInfo(Base):
    __tablename__ = "related_info"
    __table_args__ = {"schema": "dbo"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    profile_video = Column(Unicode(500))
    profile_thumbnail_url = Column(Unicode(500))
    seminar_videos = Column(Unicode(500))
    seminar_thumbnail_url = Column(Unicode(500))



class OperationLogs(Base):
    __tablename__ = "operation_logs"
    __table_args__ = {"schema": "dbo"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    target_table = Column(Unicode(20))
    target_id = Column(Integer)
    operation_type = Column(Unicode(20))
    operation_user = Column(Unicode(100))
    operation_datetime = Column(Date)
