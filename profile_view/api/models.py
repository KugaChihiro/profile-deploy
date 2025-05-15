from sqlalchemy import Column, Integer, String, Date
from api.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, unique=True, nullable=False)
    name = Column(String(100))
    kana = Column(String(100))
    birthdate = Column(Date)
    hometown = Column(String(100))
    elementary_school = Column(String(100))
    junior_high_school = Column(String(100))
    high_school = Column(String(100))
    university = Column(String(100))
    faculty = Column(String(100))
    graduate_school = Column(String(100))
    major = Column(String(100))
    photo_url = Column(String(500))