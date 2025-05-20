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
