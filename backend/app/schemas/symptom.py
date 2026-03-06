from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


SymptomCategory = Literal[
    "cramps",
    "headache",
    "mood",
    "fatigue",
    "sleep",
    "bloating",
    "nausea",
    "other",
]


class SymptomCreate(BaseModel):
    date_time: datetime
    category: SymptomCategory
    severity: int = Field(ge=1, le=10)
    notes: str | None = None
    tags: list[str] | None = None


class SymptomUpdate(BaseModel):
    date_time: datetime | None = None
    category: SymptomCategory | None = None
    severity: int | None = Field(default=None, ge=1, le=10)
    notes: str | None = None
    tags: list[str] | None = None


class SymptomResponse(BaseModel):
    id: str
    user_id: str
    date_time: datetime
    category: str
    severity: int
    notes: str | None
    tags: list[str] | None
    created_at: datetime