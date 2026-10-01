# Import all API routers.

from app.routers.auth import router as auth_router
from app.routers.companies import router as companies_router
from app.routers.applications import router as applications_router
from app.routers.interviews import router as interviews_router
from app.routers.notes import router as notes_router


__all__ = [
    "auth_router",
    "companies_router",
    "applications_router",
    "interviews_router",
    "notes_router",
]