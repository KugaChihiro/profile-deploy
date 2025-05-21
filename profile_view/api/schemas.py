from pydantic import BaseModel
from datetime import date
from typing import Optional

# employee 基本情報

class EmployeeCreate(BaseModel):
    employee_id: int
    name: str
    kana: str = None
    birthdate: date = None
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
        from_attributes = True


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    kana: Optional[str] = None
    birthdate: Optional[date] = None
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
        from_attributes = True


class EmployeeOut(BaseModel):
    id: int
    employee_id: int
    name: Optional[str] = None
    kana: Optional[str] = None
    birthdate: Optional[date] = None
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
        from_attributes = True
