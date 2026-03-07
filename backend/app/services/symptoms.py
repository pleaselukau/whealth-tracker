from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.symptom_entry import SymptomEntry


def create_symptom(
    db: Session,
    *,
    user_id,
    date_time: datetime,
    category: str,
    severity: int,
    notes: str | None = None,
    tags: list[str] | None = None,
) -> SymptomEntry:
    symptom = SymptomEntry(
        user_id=user_id,
        date_time=date_time,
        category=category,
        severity=severity,
        notes=notes,
        tags=tags,
    )
    db.add(symptom)
    db.commit()
    db.refresh(symptom)
    return symptom


def list_symptoms(
    db: Session,
    *,
    user_id,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    category: str | None = None,
    severity: int | None = None,
) -> list[SymptomEntry]:
    query = select(SymptomEntry).where(SymptomEntry.user_id == user_id)

    if date_from is not None:
        query = query.where(SymptomEntry.date_time >= date_from)
    if date_to is not None:
        query = query.where(SymptomEntry.date_time <= date_to)
    if category is not None:
        query = query.where(SymptomEntry.category == category)
    if severity is not None:
        query = query.where(SymptomEntry.severity == severity)

    query = query.order_by(SymptomEntry.date_time.desc())
    return list(db.scalars(query).all())


def get_symptom_by_id(db: Session, *, symptom_id, user_id) -> SymptomEntry | None:
    query = select(SymptomEntry).where(
        SymptomEntry.id == symptom_id,
        SymptomEntry.user_id == user_id,
    )
    return db.scalar(query)


def update_symptom(
    db: Session,
    *,
    symptom: SymptomEntry,
    date_time: datetime | None = None,
    category: str | None = None,
    severity: int | None = None,
    notes: str | None = None,
    tags: list[str] | None = None,
) -> SymptomEntry:
    if date_time is not None:
        symptom.date_time = date_time
    if category is not None:
        symptom.category = category
    if severity is not None:
        symptom.severity = severity
    if notes is not None:
        symptom.notes = notes
    if tags is not None:
        symptom.tags = tags

    db.add(symptom)
    db.commit()
    db.refresh(symptom)
    return symptom


def delete_symptom(db: Session, *, symptom: SymptomEntry) -> None:
    db.delete(symptom)
    db.commit()