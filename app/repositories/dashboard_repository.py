from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.models.application import Application


class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_application_stats(self, user_id: int) -> dict:
        stats = (
            self.db.query(
                func.count(Application.id).label("total_applications"),

                func.sum(
                    case(
                        (Application.status == "APPLIED", 1),
                        else_=0,
                    )
                ).label("applied"),

                func.sum(
                    case(
                        (Application.status == "INTERVIEW", 1),
                        else_=0,
                    )
                ).label("interview"),

                func.sum(
                    case(
                        (Application.status == "OFFER", 1),
                        else_=0,
                    )
                ).label("offer"),

                func.sum(
                    case(
                        (Application.status == "REJECTED", 1),
                        else_=0,
                    )
                ).label("rejected"),
            )
            .filter(Application.user_id == user_id)
            .one()
        )

        return {
            "total_applications": stats.total_applications,
            "applied": stats.applied or 0,
            "interview": stats.interview or 0,
            "offer": stats.offer or 0,
            "rejected": stats.rejected or 0,
        }