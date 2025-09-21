from pydantic import BaseModel
from typing import List, Optional

class PersonalInfo(BaseModel):
    full_name: str
    address: str
    email: str
    phone: str
    github_handle: Optional[str] = None
    linkedin_handle: Optional[str] = None
    portfolio_url: Optional[str] = None
    extra_info: Optional[str] = None

class Education(BaseModel):
    degree: str
    institution: str
    start_year: str
    end_year: str
    gpa: Optional[str] = None

class WorkExperience(BaseModel):
    job_title: str
    company_name: str
    location: str
    start_date: str
    end_date: str
    description_points: List[str]

class Project(BaseModel):
    project_name: str
    start_date: str
    end_date: str
    tech_stack: str
    description_points: List[str]

class SkillItem(BaseModel):
    name: str
    value: str

class Skills(BaseModel):
    languages: str
    frameworks: str
    databases: str
    tools: str
    cloud_devops: str
    certifications: str

class AchievementItem(BaseModel):
    description: str

class CertificationItem(BaseModel):
    name: str
    issuer: str
    date: str

class ResumeData(BaseModel):
    personal_info: PersonalInfo
    education: List[Education]
    work_experience: List[WorkExperience]
    projects: List[Project]
    skills: List[SkillItem]
    achievements: List[AchievementItem]
    certifications: List[CertificationItem]

class GenerationRequest(BaseModel):
    template_name: str
    resume_data: ResumeData