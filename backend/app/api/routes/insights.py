from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.api.deps import get_db
from app.schemas.insight import InsightsSummaryResponse, TimelineResponse
from app.services.insights import get_summary_insights, get_timeline_insights

router = APIRouter()


@router.get("/summary", response_model=InsightsSummaryResponse)
def insights_summary(
    from_: datetime | None = None,
    to: datetime | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_summary_insights(
        db=db,
        user_id=current_user.id,
        date_from=from_,
        date_to=to,
    )


@router.get("/timeline", response_model=TimelineResponse)
def insights_timeline(
    category: str,
    from_: datetime | None = None,
    to: datetime | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_timeline_insights(
        db=db,
        user_id=current_user.id,
        category=category,
        date_from=from_,
        date_to=to,
    )