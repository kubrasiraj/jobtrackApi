from sqlalchemy.orm import Session

from app.models.note import Note


class NoteRepository:
    # Handle database operations for notes.

    def __init__(self, db: Session):
        # Store the database session.
        self.db = db

    def create(
        self,
        application_id: int,
        content: str,
    ) -> Note:
        # Create a new note object.
        note = Note(
            application_id=application_id,
            content=content,
        )

        # Add the note to the database session.
        self.db.add(note)

        # Save the note.
        self.db.commit()

        # Refresh the object with database values.
        self.db.refresh(note)

        return note

    def get_by_id(
        self,
        note_id: int,
    ) -> Note | None:
        # Find a note by ID.
        return (
            self.db.query(Note)
            .filter(Note.id == note_id)
            .first()
        )

    def get_by_application(
        self,
        application_id: int,
    ) -> list[Note]:
        # Get all notes for an application.
        return (
            self.db.query(Note)
            .filter(Note.application_id == application_id)
            .order_by(Note.created_at.desc())
            .all()
        )

    def update(self, note: Note) -> Note:
        # Save changes made to the note.
        self.db.commit()

        # Refresh the object with updated values.
        self.db.refresh(note)

        return note

    def delete(self, note: Note) -> None:
        # Delete the note.
        self.db.delete(note)

        # Save the deletion.
        self.db.commit()