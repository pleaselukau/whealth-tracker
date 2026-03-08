from datetime import datetime, timedelta, timezone

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

    most_frequent_query = (
        select(
            SymptomEntry.category,
            func.count().label("entry_count"),
        )
        .where(SymptomEntry.user_id == user_id)
        .group_by(SymptomEntry.category)
        .order_by(func.count().desc(), SymptomEntry.category.asc())
    )

    if date_from is not None:
        most_frequent_query = most_frequent_query.where(SymptomEntry.date_time >= date_from)
    if date_to is not None:
        most_frequent_query = most_frequent_query.where(SymptomEntry.date_time <= date_to)

    most_frequent_row = db.execute(most_frequent_query).first()
    most_frequent_category = most_frequent_row.category if most_frequent_row else None

    highest_avg_query = (
        select(
            SymptomEntry.category,
            func.avg(SymptomEntry.severity).label("average_severity"),
        )
        .where(SymptomEntry.user_id == user_id)
        .group_by(SymptomEntry.category)
        .order_by(func.avg(SymptomEntry.severity).desc(), SymptomEntry.category.asc())
    )

    if date_from is not None:
        highest_avg_query = highest_avg_query.where(SymptomEntry.date_time >= date_from)
    if date_to is not None:
        highest_avg_query = highest_avg_query.where(SymptomEntry.date_time <= date_to)

    highest_avg_row = db.execute(highest_avg_query).first()
    highest_avg_severity_category = highest_avg_row.category if highest_avg_row else None

    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    entries_last_7_days_query = select(func.count()).where(
        SymptomEntry.user_id == user_id,
        SymptomEntry.date_time >= seven_days_ago,
    )
    entries_last_7_days = db.scalar(entries_last_7_days_query) or 0

    return {
        "total_entries": total_entries,
        "days_tracked": days_tracked,
        "average_severity_per_category": averages,
        "most_frequent_category": most_frequent_category,
        "highest_avg_severity_category": highest_avg_severity_category,
        "entries_last_7_days": entries_last_7_days,
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