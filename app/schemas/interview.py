from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InterviewBase(BaseModel):
    # Interview round number.
    # Example: 1, 2, 3.
    round: int

    # Date and time of the interview.
    scheduled_at: datetime

    # Interview type.
    # Example: Online, Phone, On-site.
    interview_type: str

    # Current interview status.
    status: str = "SCHEDULED"

    # Interview feedback.
    feedback: str | None = None


class InterviewCreate(InterviewBase):
    # Data needed to create an interview.
    pass


class InterviewUpdate(BaseModel):
    # All fields are optional for PATCH requests.
    round: int | None = None
    scheduled_at: datetime | None = None
    interview_type: str | None = None
    status: str | None = None
    feedback: str | None = None


class InterviewResponse(InterviewBase):
    # Interview ID.
    id: int

    # Application connected to this interview.
    application_id: int

    # Read data from SQLAlchemy models.
    model_config = ConfigDict(from_attributes=True)