from sqlalchemy.orm import Session

from app.models.company import Company


class CompanyRepository:
    # Handle database operations for companies.

    def __init__(self, db: Session):
        # Store the database session.
        self.db = db

    def create(
        self,
        name: str,
        industry: str | None = None,
        website: str | None = None,
        location: str | None = None,
    ) -> Company:
        # Create a new company object.
        company = Company(
            name=name,
            industry=industry,
            website=website,
            location=location,
        )

        # Add the company to the database session.
        self.db.add(company)

        # Save the company.
        self.db.commit()

        # Refresh the object with database values.
        self.db.refresh(company)

        return company

    def get_by_id(self, company_id: int) -> Company | None:
        # Find a company by ID.
        return (
            self.db.query(Company)
            .filter(Company.id == company_id)
            .first()
        )

    def get_all(
        self,
        skip: int = 0,
        limit: int = 10,
    ) -> list[Company]:
        # Get companies with pagination.
        return (
            self.db.query(Company)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update(self, company: Company) -> Company:
        # Save changes made to the company.
        self.db.commit()

        # Refresh the object with updated values.
        self.db.refresh(company)

        return company

    def delete(self, company: Company) -> None:
        # Delete the company.
        self.db.delete(company)

        # Save the deletion.
        self.db.commit()