from datetime import datetime,timezone

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Note(Base):
    # Name of the database table.
    __tablename__ = "notes"

    # Unique ID for each note.
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # ID of the application this note belongs to.
    application_id: Mapped[int] = mapped_column(
        ForeignKey("applications.id"),
        nullable=False,
        index=True,
    )

    # Note content.
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Date and time when the note was created.
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        nullable=False,
    )

    # Connect note with its application.
    application: Mapped["Application"] = relationship(
        back_populates="notes",
    )