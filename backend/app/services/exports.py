import csv
import io
from datetime import datetime

from sqlalchemy.orm import Session

from app.services.symptoms import list_symptoms


def generate_symptoms_csv(
    db: Session,
    *,
    user_id,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    category: str | None = None,
) -> str:
    symptoms = list_symptoms(
        db=db,
        user_id=user_id,
        date_from=date_from,
        date_to=date_to,
        category=category,
    )

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["date_time", "category", "severity", "notes", "tags"])

    for symptom in symptoms:
        tags = ";".join(symptom.tags) if symptom.tags else ""
        writer.writerow(
            [
                symptom.date_time.isoformat(),
                symptom.category,
                symptom.severity,
                symptom.notes or "",
                tags,
            ]
        )

    return output.getvalue()