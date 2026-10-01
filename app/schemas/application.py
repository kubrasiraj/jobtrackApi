from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ApplicationBase(BaseModel):
    # Job title.
    job_title: str

    # Type of job.
    # Example: Internship or Full-time.
    job_type: str

    # Current application status.
    # Example: APPLIED, INTERVIEW, OFFER.
    status: str = "APPLIED"

    # Date when the user applied.
    applied_date: date

    # Salary can be empty if it is not known.
    salary: int | None = None

    # Extra information about the job.
    description: str | None = None


class ApplicationCreate(ApplicationBase):
    # Company ID tells us which company this application belongs to.
    company_id: int


class ApplicationUpdate(BaseModel):
    # All fields are optional for PATCH requests.
    job_title: str | None = None
    job_type: str | None = None
    status: str | None = None
    applied_date: date | None = None
    salary: int | None = None
    description: str | None = None
    company_id: int | None = None


class ApplicationResponse(ApplicationBase):
    # Application ID.
    id: int

    # User who created the application.
    user_id: int

    # Company connected to the application.
    company_id: int

    # Date when the application was created.
    created_at: datetime

    # Date when the application was last updated.
    updated_at: datetime

    # Read data from SQLAlchemy models.
    model_config = ConfigDict(from_attributes=True)