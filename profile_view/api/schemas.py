from pydantic import BaseModel, Field
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


# EmploymentHistory 職務情報

class EmploymentHistoryCreate(BaseModel):
    employee_id: int
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    knowledge: Optional[str] = None

class EmploymentHistoryUpdate(BaseModel):
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    knowledge: Optional[str] = None

class EmploymentHistoryOut(BaseModel):
    id: int
    employee_id: int
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    knowledge: Optional[str] = None
    class Config:
        orm_mode = True



#project_info 業務情報

class ProjectInfoCreate(BaseModel):
    employee_id: int
    project: Optional[str] = None
    skill: Optional[str] = None
    comment: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class ProjectInfoUpdate(BaseModel):
    project: Optional[str] = None
    skill: Optional[str] = None
    comment: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class ProjectInfoOut(BaseModel):
    id: int
    employee_id: int
    project: Optional[str] = None
    skill: Optional[str] = None
    comment: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    class Config:
        orm_mode = True


# insight_info 知見情報


class InsightInfoCreate(BaseModel):
    employee_id: int
    insight: Optional[str] = None
    skill: Optional[str] = None
    comment: Optional[str] = None

class InsightInfoUpdate(BaseModel):
    insight: Optional[str] = None
    skill: Optional[str] = None
    comment: Optional[str] = None

class InsightInfoOut(BaseModel):
    id: int
    employee_id: int
    insight: Optional[str] = None
    skill: Optional[str] = None
    comment: Optional[str] = None
    class Config:
        orm_mode = True

# skill_info スキル情報


class SkillInfoCreate(BaseModel):
    employee_id: int
    skill: Optional[str] = None

class SkillInfoUpdate(BaseModel):
    skill: Optional[str] = None

class SkillInfoOut(BaseModel):
    id: int
    employee_id: int
    skill: Optional[str] = None
    class Config:
        orm_mode = True

# private_info プライベート情報

class PrivateInfoCreate(BaseModel):
    employee_id: int
    blood_type: Optional[str] = None
    nickname: Optional[str] = None
    mbti: Optional[str] = None
    family_structure: Optional[str] = None
    father_job: Optional[str] = None
    mother_job: Optional[str] = None
    lessons: Optional[str] = None
    club_activities: Optional[str] = None
    jobs: Optional[str] = None
    circles: Optional[str] = None
    hobbies: Optional[str] = None
    favorite_foods: Optional[str] = None
    disliked_foods: Optional[str] = None
    holiday_activities: Optional[str] = None
    favorite_celebrities: Optional[str] = None
    favorite_characters: Optional[str] = None
    favorite_artists: Optional[str] = None
    favorite_comedians: Optional[str] = None

class PrivateInfoUpdate(BaseModel):
    blood_type: Optional[str] = None
    nickname: Optional[str] = None
    mbti: Optional[str] = None
    family_structure: Optional[str] = None
    father_job: Optional[str] = None
    mother_job: Optional[str] = None
    lessons: Optional[str] = None
    club_activities: Optional[str] = None
    jobs: Optional[str] = None
    circles: Optional[str] = None
    hobbies: Optional[str] = None
    favorite_foods: Optional[str] = None
    disliked_foods: Optional[str] = None
    holiday_activities: Optional[str] = None
    favorite_celebrities: Optional[str] = None
    favorite_characters: Optional[str] = None
    favorite_artists: Optional[str] = None
    favorite_comedians: Optional[str] = None

class PrivateInfoOut(BaseModel):
    id: int
    employee_id: int
    blood_type: Optional[str] = None
    nickname: Optional[str] = None
    mbti: Optional[str] = None
    family_structure: Optional[str] = None
    father_job: Optional[str] = None
    mother_job: Optional[str] = None
    lessons: Optional[str] = None
    club_activities: Optional[str] = None
    jobs: Optional[str] = None
    circles: Optional[str] = None
    hobbies: Optional[str] = None
    favorite_foods: Optional[str] = None
    disliked_foods: Optional[str] = None
    holiday_activities: Optional[str] = None
    favorite_celebrities: Optional[str] = None
    favorite_characters: Optional[str] = None
    favorite_artists: Optional[str] = None
    favorite_comedians: Optional[str] = None
    class Config:
        orm_mode = True



# related_info 関連情報

class RelatedInfoCreate(BaseModel):
    employee_id: int
    profile_video: Optional[str] = None
    seminar_videos: Optional[str] = None

class RelatedInfoUpdate(BaseModel):
    profile_video: Optional[str] = None
    seminar_videos: Optional[str] = None

class RelatedInfoOut(BaseModel):
    id: int
    employee_id: int
    profile_video: Optional[str] = None
    seminar_videos: Optional[str] = None
    class Config:
        orm_mode = True

# operation_logs 履歴管理

class OperationLogsCreate(BaseModel):
    employee_id: int
    target_table: Optional[str] = None
    target_id: Optional[int] = None
    operation_type: Optional[str] = None
    operation_user: Optional[str] = None
    operation_datetime: Optional[date] = None

class OperationLogsUpdate(BaseModel):
    target_table: Optional[str] = None
    target_id: Optional[int] = None
    operation_type: Optional[str] = None
    operation_user: Optional[str] = None
    operation_datetime: Optional[date] = None

class OperationLogsOut(BaseModel):
    id: int
    employee_id: int
    target_table: Optional[str] = None
    target_id: Optional[int] = None
    operation_type: Optional[str] = None
    operation_user: Optional[str] = None
    operation_datetime: Optional[date] = None
    class Config:
        orm_mode = True




#  SASトークン発行リクエスト
class SasTokenRequest(BaseModel):

    file_name: str = Field(..., alias="fileName", description="アップロードするファイル名")

# SASトークン発行レスポンス
class SasTokenResponse(BaseModel):
    sas_url: str = Field(..., alias="sasUrl", description="アップロードに使う一時的な署名付きURL")
    storage_url: str = Field(..., alias="storageUrl", description="DBに保存する永続的なファイルのURL")