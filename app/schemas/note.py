from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NoteCreate(BaseModel):
    # Note written about an application.
    content: str


class NoteUpdate(BaseModel):
    # New note content.
    content: str


class NoteResponse(BaseModel):
    # Note ID.
    id: int

    # Application connected to this note.
    application_id: int

    # Note content.
    content: str

    # Date when the note was created.
    created_at: datetime

    # Read data from SQLAlchemy models.
    model_config = ConfigDict(from_attributes=True)