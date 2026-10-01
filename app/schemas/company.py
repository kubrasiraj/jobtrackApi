from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CompanyBase(BaseModel):
    # Company name.
    name: str

    # Company's industry.
    industry: str | None = None

    # Company's website.
    website: str | None = None

    # Company's location.
    location: str | None = None


class CompanyCreate(CompanyBase):
    # Data needed to create a company.
    pass


class CompanyUpdate(BaseModel):
    # All fields are optional because this is a PATCH request.
    name: str | None = None
    industry: str | None = None
    website: str | None = None
    location: str | None = None


class CompanyResponse(CompanyBase):
    # Company's unique ID.
    id: int

    # Date when the company was created.
    created_at: datetime

    # Read data from SQLAlchemy models.
    model_config = ConfigDict(from_attributes=True)