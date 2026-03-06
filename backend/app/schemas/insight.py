from datetime import date

from pydantic import BaseModel


class CategoryAverage(BaseModel):
    category: str
    average_severity: float


class InsightsSummaryResponse(BaseModel):
    total_entries: int
    days_tracked: int
    average_severity_per_category: list[CategoryAverage]


class TimelinePoint(BaseModel):
    date: date
    average_severity: float


class TimelineResponse(BaseModel):
    category: str
    points: list[TimelinePoint]