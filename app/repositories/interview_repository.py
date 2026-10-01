from sqlalchemy.orm import Session

from app.models.interview import Interview


class InterviewRepository:
    # Handle database operations for interviews.

    def __init__(self, db: Session):
        # Store the database session.
        self.db = db

    def create(
        self,
        application_id: int,
        round: int,
        scheduled_at,
        interview_type: str,
        status: str = "SCHEDULED",
        feedback: str | None = None,
    ) -> Interview:
        # Create a new interview object.
        interview = Interview(
            application_id=application_id,
            round=round,
            scheduled_at=scheduled_at,
            interview_type=interview_type,
            status=status,
            feedback=feedback,
        )

        # Add the interview to the database session.
        self.db.add(interview)

        # Save the interview.
        self.db.commit()

        # Refresh the object with database values.
        self.db.refresh(interview)

        return interview

    def get_by_id(
        self,
        interview_id: int,
    ) -> Interview | None:
        # Find an interview by ID.
        return (
            self.db.query(Interview)
            .filter(Interview.id == interview_id)
            .first()
        )

    def get_by_application(
        self,
        application_id: int,
    ) -> list[Interview]:
        # Get all interviews for an application.
        return (
            self.db.query(Interview)
            .filter(Interview.application_id == application_id)
            .order_by(Interview.round)
            .all()
        )

    def update(self, interview: Interview) -> Interview:
        # Save changes made to the interview.
        self.db.commit()

        # Refresh the object with updated values.
        self.db.refresh(interview)

        return interview

    def delete(self, interview: Interview) -> None:
        # Delete the interview.
        self.db.delete(interview)

        # Save the deletion.
        self.db.commit()