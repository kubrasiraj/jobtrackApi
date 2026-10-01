
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteUpdate,
)
from app.services.note_service import NoteService


router = APIRouter(
    prefix="/api/v1",
    tags=["Notes"],
)


@router.post(
    "/applications/{application_id}/notes",
    response_model=NoteResponse,
    status_code=201,
)
def create_note(
    application_id: int,
    note_data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NoteService(db)

    user_id = current_user.id

    return service.create_note(
        user_id=user_id,
        application_id=application_id,
        note_data=note_data,
    )


@router.get(
    "/applications/{application_id}/notes",
    response_model=list[NoteResponse],
)
def get_notes(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NoteService(db)

    user_id = current_user.id

    return service.get_notes(
        user_id=user_id,
        application_id=application_id,
    )


@router.patch(
    "/notes/{note_id}",
    response_model=NoteResponse,
)
def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NoteService(db)

    user_id = current_user.id

    note = service.update_note(
        user_id=user_id,
        note_id=note_id,
        note_data=note_data,
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found.",
        )

    return note


@router.delete(
    "/notes/{note_id}",
    status_code=204,
)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NoteService(db)

    user_id = current_user.id

    deleted = service.delete_note(
        user_id=user_id,
        note_id=note_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Note not found.",
        )

