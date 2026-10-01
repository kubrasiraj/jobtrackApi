
from sqlalchemy.orm import Session

from app.core.exceptions import BusinessError
from app.models.application import Application
from app.repositories.application_repository import ApplicationRepository
from app.repositories.company_repository import CompanyRepository
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
)


class ApplicationService:
    # Handle business logic related to job applications.

    def __init__(self, db: Session):
        # Create repositories needed by this service.
        self.repository = ApplicationRepository(db)
        self.company_repository = CompanyRepository(db)

    def create_application(
        self,
        user_id: int,
        application_data: ApplicationCreate,
    ) -> Application:
        # Check that the selected company exists.
        company = self.company_repository.get_by_id(
            application_data.company_id
        )

        if not company:
            raise BusinessError("Company not found.")

        # Create the application.
        return self.repository.create(
            user_id=user_id,
            company_id=application_data.company_id,
            job_title=application_data.job_title,
            job_type=application_data.job_type,
            status=application_data.status,
            applied_date=application_data.applied_date,
            salary=application_data.salary,
            description=application_data.description,
        )

    def get_application(
        self,
        user_id: int,
        application_id: int,
    ) -> Application | None:
        # Get the application.
        application = self.repository.get_by_id(
            application_id
        )

        if not application:
            return None

        # Make sure the application belongs to this user.
        if application.user_id != user_id:
            return None

        return application

    def get_user_applications(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 10,
        status: str | None = None,
        company_id: int | None = None,
    ) -> list[Application]:
        # Filter by status if provided.
        if status:
            return self.repository.get_by_user_and_status(
                user_id=user_id,
                status=status,
                skip=skip,
                limit=limit,
            )

        # Filter by company if provided.
        if company_id:
            return self.repository.get_by_company(
                user_id=user_id,
                company_id=company_id,
                skip=skip,
                limit=limit,
            )

        # Otherwise return all user's applications.
        return self.repository.get_by_user(
            user_id=user_id,
            skip=skip,
            limit=limit,
        )

    def update_application(
        self,
        user_id: int,
        application_id: int,
        application_data: ApplicationUpdate,
    ) -> Application | None:
        # Find the application.
        application = self.repository.get_by_id(
            application_id
        )

        if not application:
            return None

        # Make sure the application belongs to this user.
        if application.user_id != user_id:
            return None

        # If company is being changed, check that it exists.
        if application_data.company_id is not None:
            company = self.company_repository.get_by_id(
                application_data.company_id
            )

            if not company:
                raise BusinessError("Company not found.")

        # Get only fields sent by the client.
        update_data = application_data.model_dump(
            exclude_unset=True
        )

        # Update the application fields.
        for field, value in update_data.items():
            setattr(application, field, value)

        # Save the changes.
        return self.repository.update(application)

    def delete_application(
        self,
        user_id: int,
        application_id: int,
    ) -> bool:
        # Find the application.
        application = self.repository.get_by_id(
            application_id
        )

        if not application:
            return False

        # Make sure the application belongs to this user.
        if application.user_id != user_id:
            return False

        # Delete the application.
        self.repository.delete(application)

        return True

