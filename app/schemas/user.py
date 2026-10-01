from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    # Basic user information.
    name: str
    email: EmailStr


class UserCreate(UserBase):
    # Password received when creating a new user.
    password: str


class UserResponse(UserBase):
    # User ID returned by the API.
    id: int

    # User role returned by the API.
    role: str

    # User creation date.
    created_at: datetime

    # Allow Pydantic to read data from SQLAlchemy models.
    model_config = ConfigDict(from_attributes=True)