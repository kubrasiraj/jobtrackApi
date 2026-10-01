
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.models.user import User
from app.db.database import get_db

from app.schemas.company import (
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
)

from app.services.company_service import CompanyService


router = APIRouter(
    prefix="/api/v1/companies",
    tags=["Companies"],
)


@router.post(
    "/",
    response_model=CompanyResponse,
    status_code=201,
)
def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CompanyService(db)

    return service.create_company(company_data)


@router.get(
    "/",
    response_model=list[CompanyResponse],
)
def get_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CompanyService(db)

    return service.get_companies(
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
)
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CompanyService(db)

    company = service.get_company(company_id)

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found.",
        )

    return company


@router.patch(
    "/{company_id}",
    response_model=CompanyResponse,
)
def update_company(
    company_id: int,
    company_data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CompanyService(db)

    company = service.update_company(
        company_id=company_id,
        company_data=company_data,
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found.",
        )

    return company


@router.delete(
    "/{company_id}",
    status_code=204,
)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CompanyService(db)

    deleted = service.delete_company(company_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Company not found.",
        )

