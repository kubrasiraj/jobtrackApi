from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, db: Session):
        self.repository = DashboardRepository(db)

    def get_application_stats(self, user_id: int) -> dict:
        return self.repository.get_application_stats(
            user_id=user_id,
        )