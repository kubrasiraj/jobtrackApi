from datetime import date, datetime,timezone

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


from app.db.base import Base


class Application(Base):
    # Name of the database table.
    __tablename__ = "applications"

    # Unique ID for each application.
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # ID of the user who created this application.
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # ID of the company for this application.
    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id"),
        nullable=False,
        index=True,
    )

    # Job title.
    # Example: Python Backend Intern.
    job_title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    # Type of job.
    # Example: Internship, Full-time, Part-time.
    job_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # Current application status.
    # Example: Applied, Interview, Offer, Rejected.
    status: Mapped[str] = mapped_column(
        String(50),
        default="APPLIED",
        nullable=False,
        index=True,
    )

    # Date when the user applied.
    applied_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    # Expected or offered salary.
    salary: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # Extra information about the job.
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Date and time when the application was created.
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        nullable=False,
    )

    # Date and time when the application was last updated.
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default= datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )

    # Connect application with its user.
    user: Mapped["User"] = relationship(
        back_populates="applications",
    )

    # Connect application with its company.
    company: Mapped["Company"] = relationship(
        back_populates="applications",
    )

    # Get all interviews for this application.
    interviews: Mapped[list["Interview"]] = relationship(
        back_populates="application",
        cascade="all, delete-orphan",
    )

    # Get all notes for this application.
    notes: Mapped[list["Note"]] = relationship(
        back_populates="application",
        cascade="all, delete-orphan",
    )