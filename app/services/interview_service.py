
from sqlalchemy.orm import Session

from app.core.exceptions import BusinessError
from app.models.interview import Interview
from app.repositories.application_repository import ApplicationRepository
from app.repositories.interview_repository import InterviewRepository
from app.schemas.interview import InterviewCreate, InterviewUpdate


class InterviewService:
    # Handle business logic related to interviews.

    def __init__(self, db: Session):
        # Create repositories needed by this service.
        self.repository = InterviewRepository(db)
        self.application_repository = ApplicationRepository(db)

    def create_interview(
        self,
        user_id: int,
        application_id: int,
        interview_data: InterviewCreate,
    ) -> Interview:
        # Check that the application exists.
        application = self.application_repository.get_by_id(
            application_id
        )

        if not application:
            raise BusinessError("Application not found.")

        # Make sure the application belongs to this user.
        if application.user_id != user_id:
            raise BusinessError("You cannot access this application.")

        # Create the interview.
        return self.repository.create(
            application_id=application_id,
            round=interview_data.round,
            scheduled_at=interview_data.scheduled_at,
            interview_type=interview_data.interview_type,
            status=interview_data.status,
            feedback=interview_data.feedback,
        )

    def get_interviews(
        self,
        user_id: int,
        application_id: int,
    ) -> list[Interview]:
        # Check that the application exists.
        application = self.application_repository.get_by_id(
            application_id
        )

        if not application:
            raise BusinessError("Application not found.")

        # Check ownership.
        if application.user_id != user_id:
            raise BusinessError("You cannot access this application.")

        # Get all interviews.
        return self.repository.get_by_application(
            application_id
        )

    def update_interview(
        self,
        user_id: int,
        interview_id: int,
        interview_data: InterviewUpdate,
    ) -> Interview | None:
        # Find the interview.
        interview = self.repository.get_by_id(
            interview_id
        )

        if not interview:
            return None

        # Find its application.
        application = self.application_repository.get_by_id(
            interview.application_id
        )

        if not application or application.user_id != user_id:
            return None

        # Get only fields sent by the client.
        update_data = interview_data.model_dump(
            exclude_unset=True
        )

        # Update the interview fields.
        for field, value in update_data.items():
            setattr(interview, field, value)

        # Save the changes.
        return self.repository.update(interview)

    def delete_interview(
        self,
        user_id: int,
        interview_id: int,
    ) -> bool:
        # Find the interview.
        interview = self.repository.get_by_id(
            interview_id
        )

        if not interview:
            return False

        # Find the related application.
        application = self.application_repository.get_by_id(
            interview.application_id
        )

        if not application or application.user_id != user_id:
            return False

        # Delete the interview.
        self.repository.delete(interview)

        return True

