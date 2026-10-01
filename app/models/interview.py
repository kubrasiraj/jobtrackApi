from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Interview(Base):
    # Name of the database table.
    __tablename__ = "interviews"

    # Unique ID for each interview.
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # ID of the application this interview belongs to.
    application_id: Mapped[int] = mapped_column(
        ForeignKey("applications.id"),
        nullable=False,
        index=True,
    )

    # Interview round number.
    # Example: 1, 2, 3.
    round: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # Date and time of the interview.
    scheduled_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    # Type of interview.
    # Example: Online, Phone, On-site.
    interview_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # Interview status.
    # Example: Scheduled, Completed, Cancelled.
    status: Mapped[str] = mapped_column(
        String(50),
        default="SCHEDULED",
        nullable=False,
    )

    # Feedback after the interview.
    feedback: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Connect interview with its application.
    application: Mapped["Application"] = relationship(
        back_populates="interviews",
    )