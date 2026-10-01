from datetime import datetime,timezone

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Company(Base):
    # Name of the database table.
    __tablename__ = "companies"

    # Unique ID for each company.
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # Company name.
    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    # Company's industry.
    # Example: Software, Banking, E-commerce.
    industry: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # Company's website.
    website: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # Company's location.
    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    # Date and time when the company was created.
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        nullable=False,
    )

    # Get all applications for this company.
    applications: Mapped[list["Application"]] = relationship(
        back_populates="company",
    )