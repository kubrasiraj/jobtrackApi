
from sqlalchemy.orm import Session

from app.core.exceptions import BusinessError
from app.models.company import Company
from app.repositories.company_repository import CompanyRepository
from app.schemas.company import CompanyCreate, CompanyUpdate


class CompanyService:
    # Handle business logic related to companies.

    def __init__(self, db: Session):
        # Create the company repository.
        self.repository = CompanyRepository(db)

    def create_company(
        self,
        company_data: CompanyCreate,
    ) -> Company:
        # Check if a company with the same name already exists.
        companies = self.repository.get_all(
            skip=0,
            limit=100,
        )

        for company in companies:
            if company.name.lower() == company_data.name.lower():
                raise BusinessError(
                    "Company already exists."
                )

        # Create the company through the repository.
        return self.repository.create(
            name=company_data.name,
            industry=company_data.industry,
            website=company_data.website,
            location=company_data.location,
        )

    def get_company(
        self,
        company_id: int,
    ) -> Company | None:
        # Get one company by ID.
        return self.repository.get_by_id(company_id)

    def get_companies(
        self,
        skip: int = 0,
        limit: int = 10,
    ) -> list[Company]:
        # Get a paginated list of companies.
        return self.repository.get_all(
            skip=skip,
            limit=limit,
        )

    def update_company(
        self,
        company_id: int,
        company_data: CompanyUpdate,
    ) -> Company | None:
        # Find the company first.
        company = self.repository.get_by_id(company_id)

        if not company:
            return None

        # Get only the fields sent by the client.
        update_data = company_data.model_dump(
            exclude_unset=True
        )

        # Update each provided field.
        for field, value in update_data.items():
            setattr(company, field, value)

        # Save the updated company.
        return self.repository.update(company)

    def delete_company(
        self,
        company_id: int,
    ) -> bool:
        # Find the company.
        company = self.repository.get_by_id(company_id)

        if not company:
            return False

        # Delete the company.
        self.repository.delete(company)

        return True

