from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_applications: int
    applied: int
    interview: int
    offer: int
    rejected: int