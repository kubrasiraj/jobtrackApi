
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationUpdate,
)
from app.services.application_service import ApplicationService


router = APIRouter(
    prefix="/api/v1/applications",
    tags=["Applications"],
)


@router.post(
    "/",
    response_model=ApplicationResponse,
    status_code=201,
)
def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ApplicationService(db)

    user_id = current_user.id

    return service.create_application(
        user_id=user_id,
        application_data=application_data,
    )


@router.get(
    "/",
    response_model=list[ApplicationResponse],
)
def get_applications(
    status: str | None = Query(None),
    company_id: int | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ApplicationService(db)

    user_id = current_user.id

    return service.get_user_applications(
        user_id=user_id,
        skip=skip,
        limit=limit,
        status=status,
        company_id=company_id,
    )


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ApplicationService(db)

    user_id = current_user.id

    application = service.get_application(
        user_id=user_id,
        application_id=application_id,
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    return application


@router.patch(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application(
    application_id: int,
    application_data: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ApplicationService(db)

    user_id = current_user.id

    application = service.update_application(
        user_id=user_id,
        application_id=application_id,
        application_data=application_data,
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    return application


@router.delete(
    "/{application_id}",
    status_code=204,
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ApplicationService(db)

    user_id = current_user.id

    deleted = service.delete_application(
        user_id=user_id,
        application_id=application_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )