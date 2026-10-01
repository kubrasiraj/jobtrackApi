
from sqlalchemy.orm import Session

from app.core.exceptions import BusinessError
from app.models.note import Note
from app.repositories.application_repository import ApplicationRepository
from app.repositories.note_repository import NoteRepository
from app.schemas.note import NoteCreate, NoteUpdate


class NoteService:
    # Handle business logic related to notes.

    def __init__(self, db: Session):
        self.repository = NoteRepository(db)
        self.application_repository = ApplicationRepository(db)

    def create_note(
        self,
        user_id: int,
        application_id: int,
        note_data: NoteCreate,
    ) -> Note:
        # Check that the application exists.
        application = self.application_repository.get_by_id(
            application_id
        )

        if not application:
            raise BusinessError(
                "Application not found."
            )

        # Check application ownership.
        if application.user_id != user_id:
            raise BusinessError(
                "You cannot access this application."
            )

        # Create the note.
        return self.repository.create(
            application_id=application_id,
            content=note_data.content,
        )

    def get_notes(
        self,
        user_id: int,
        application_id: int,
    ) -> list[Note]:
        # Check that the application exists.
        application = self.application_repository.get_by_id(
            application_id
        )

        if not application:
            raise BusinessError(
                "Application not found."
            )

        # Check application ownership.
        if application.user_id != user_id:
            raise BusinessError(
                "You cannot access this application."
            )

        # Get all notes for the application.
        return self.repository.get_by_application(
            application_id
        )

    def update_note(
        self,
        user_id: int,
        note_id: int,
        note_data: NoteUpdate,
    ) -> Note | None:
        # Find the note.
        note = self.repository.get_by_id(note_id)

        if not note:
            return None

        # Find the related application.
        application = self.application_repository.get_by_id(
            note.application_id
        )

        if not application or application.user_id != user_id:
            return None

        # Update the note content.
        note.content = note_data.content

        # Save the changes.
        return self.repository.update(note)

    def delete_note(
        self,
        user_id: int,
        note_id: int,
    ) -> bool:
        # Find the note.
        note = self.repository.get_by_id(note_id)

        if not note:
            return False

        # Find the related application.
        application = self.application_repository.get_by_id(
            note.application_id
        )

        if not application or application.user_id != user_id:
            return False

        # Delete the note.
        self.repository.delete(note)

        return True

