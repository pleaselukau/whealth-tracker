from datetime import datetime

from sqlalchemy import Date, cast, distinct, func, select
from sqlalchemy.orm import Session

from app.models.symptom_entry import SymptomEntry


def get_summary_insights(
    db: Session,
    *,
    user_id,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
) -> dict:
    base_query = select(SymptomEntry).where(SymptomEntry.user_id == user_id)

    if date_from is not None:
        base_query = base_query.where(SymptomEntry.date_time >= date_from)
    if date_to is not None:
        base_query = base_query.where(SymptomEntry.date_time <= date_to)

    total_entries_query = select(func.count()).select_from(base_query.subquery())
    total_entries = db.scalar(total_entries_query) or 0

    days_tracked_query = select(
        func.count(distinct(cast(SymptomEntry.date_time, Date)))
    ).where(SymptomEntry.user_id == user_id)

    if date_from is not None:
        days_tracked_query = days_tracked_query.where(SymptomEntry.date_time >= date_from)
    if date_to is not None:
        days_tracked_query = days_tracked_query.where(SymptomEntry.date_time <= date_to)

    days_tracked = db.scalar(days_tracked_query) or 0

    averages_query = (
        select(
            SymptomEntry.category,
            func.avg(SymptomEntry.severity).label("average_severity"),
        )
        .where(SymptomEntry.user_id == user_id)
        .group_by(SymptomEntry.category)
        .order_by(SymptomEntry.category)
    )

    if date_from is not None:
        averages_query = averages_query.where(SymptomEntry.date_time >= date_from)
    if date_to is not None:
        averages_query = averages_query.where(SymptomEntry.date_time <= date_to)

    averages = [
        {
            "category": row.category,
            "average_severity": float(row.average_severity),
        }
        for row in db.execute(averages_query)
    ]

    return {
        "total_entries": total_entries,
        "days_tracked": days_tracked,
        "average_severity_per_category": averages,
    }


def get_timeline_insights(
    db: Session,
    *,
    user_id,
    category: str,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
) -> dict:
    query = (
        select(
            cast(SymptomEntry.date_time, Date).label("entry_date"),
            func.avg(SymptomEntry.severity).label("average_severity"),
        )
        .where(
            SymptomEntry.user_id == user_id,
            SymptomEntry.category == category,
        )
        .group_by(cast(SymptomEntry.date_time, Date))
        .order_by(cast(SymptomEntry.date_time, Date))
    )

    if date_from is not None:
        query = query.where(SymptomEntry.date_time >= date_from)
    if date_to is not None:
        query = query.where(SymptomEntry.date_time <= date_to)

    points = [
        {
            "date": row.entry_date,
            "average_severity": float(row.average_severity),
        }
        for row in db.execute(query)
    ]

    return {
        "category": category,
        "points": points,
    }