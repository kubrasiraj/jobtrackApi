
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.interview import (
    InterviewCreate,
    InterviewResponse,
    InterviewUpdate,
)
from app.services.interview_service import InterviewService


router = APIRouter(
    prefix="/api/v1",
    tags=["Interviews"],
)


@router.post(
    "/applications/{application_id}/interviews",
    response_model=InterviewResponse,
    status_code=201,
)
def create_interview(
    application_id: int,
    interview_data: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = InterviewService(db)

    user_id = current_user.id

    return service.create_interview(
        user_id=user_id,
        application_id=application_id,
        interview_data=interview_data,
    )


@router.get(
    "/applications/{application_id}/interviews",
    response_model=list[InterviewResponse],
)
def get_interviews(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = InterviewService(db)

    user_id = current_user.id

    return service.get_interviews(
        user_id=user_id,
        application_id=application_id,
    )


@router.patch(
    "/interviews/{interview_id}",
    response_model=InterviewResponse,
)
def update_interview(
    interview_id: int,
    interview_data: InterviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = InterviewService(db)

    user_id = current_user.id

    interview = service.update_interview(
        user_id=user_id,
        interview_id=interview_id,
        interview_data=interview_data,
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found.",
        )

    return interview


@router.delete(
    "/interviews/{interview_id}",
    status_code=204,
)
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = InterviewService(db)

    user_id = current_user.id

    deleted = service.delete_interview(
        user_id=user_id,
        interview_id=interview_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Interview not found.",
        )
