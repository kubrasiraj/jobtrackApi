from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse

from app.core.config import settings
from app.core.exceptions import BusinessError

from app.routers.auth import router as auth_router
from app.routers.companies import router as companies_router
from app.routers.applications import router as applications_router
from app.routers.interviews import router as interviews_router
from app.routers.notes import router as notes_router
from app.routers.dashboard import router as dashboard_router


app = FastAPI(
    title="JobTrack API",
    description="Job and internship application management API",
    version="1.0.0",
)


# Allow requests from the configured frontend.
cors_origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(BusinessError)
async def business_error_handler(
    request: Request,
    exc: BusinessError,
):
    return JSONResponse(
        status_code=400,
        content={
            "detail": exc.message,
        },
    )


# API routes
app.include_router(auth_router)
app.include_router(companies_router)
app.include_router(applications_router)
app.include_router(interviews_router)
app.include_router(notes_router)
app.include_router(dashboard_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JobTrack API",
    }


# -----------------------------
# React Frontend
# -----------------------------

FRONTEND_DIR = Path("/app/frontend/dist")
INDEX_FILE = FRONTEND_DIR / "index.html"


@app.get("/")
async def frontend_root():
    return FileResponse(INDEX_FILE)


@app.get("/{full_path:path}")
async def frontend_fallback(full_path: str):
    file_path = FRONTEND_DIR / full_path

    if file_path.is_file():
        return FileResponse(file_path)

    # React Router fallback
    return FileResponse(INDEX_FILE)