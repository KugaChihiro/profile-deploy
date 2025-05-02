from pydantic import BaseModel
from datetime import date
from typing import Optional

class Employees(BaseModel):
    id: int
    employee_id: int
    name: str
    kana: str
    birthdate: date
    hometown: Optional[str] = None
    elementary_school: Optional[str] = None
    junior_high_school: Optional[str] = None
    high_school: Optional[str] = None
    university: Optional[str] = None
    faculty: Optional[str] = None
    graduate_school: Optional[str] = None
    major: Optional[str] = None
    photo_url: Optional[str] = None

    class Config:
        orm_mode = True
