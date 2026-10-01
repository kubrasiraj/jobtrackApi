from sqlalchemy.orm import Session

from app.models.application import Application


class ApplicationRepository:
    # Handle database operations for applications.

    def __init__(self, db: Session):
        # Store the database session.
        self.db = db

    def create(
        self,
        user_id: int,
        company_id: int,
        job_title: str,
        job_type: str,
        applied_date,
        status: str = "APPLIED",
        salary: int | None = None,
        description: str | None = None,
    ) -> Application:
        # Create a new application object.
        application = Application(
            user_id=user_id,
            company_id=company_id,
            job_title=job_title,
            job_type=job_type,
            status=status,
            applied_date=applied_date,
            salary=salary,
            description=description,
        )

        # Add the application to the database session.
        self.db.add(application)

        # Save the application.
        self.db.commit()

        # Refresh the object with database values.
        self.db.refresh(application)

        return application

    def get_by_id(
        self,
        application_id: int,
    ) -> Application | None:
        # Find an application by ID.
        return (
            self.db.query(Application)
            .filter(Application.id == application_id)
            .first()
        )

    def get_by_user(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 10,
    ) -> list[Application]:
        # Get applications created by one user.
        return (
            self.db.query(Application)
            .filter(Application.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_user_and_status(
        self,
        user_id: int,
        status: str,
        skip: int = 0,
        limit: int = 10,
    ) -> list[Application]:
        # Get a user's applications with a specific status.
        return (
            self.db.query(Application)
            .filter(
                Application.user_id == user_id,
                Application.status == status,
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_company(
        self,
        user_id: int,
        company_id: int,
        skip: int = 0,
        limit: int = 10,
    ) -> list[Application]:
        # Get a user's applications for one company.
        return (
            self.db.query(Application)
            .filter(
                Application.user_id == user_id,
                Application.company_id == company_id,
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update(self, application: Application) -> Application:
        # Save changes made to the application.
        self.db.commit()

        # Refresh the object with updated values.
        self.db.refresh(application)

        return application

    def delete(self, application: Application) -> None:
        # Delete the application.
        self.db.delete(application)

        # Save the deletion.
        self.db.commit()