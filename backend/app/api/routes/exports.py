from datetime import datetime

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.api.deps import get_db
from app.services.audit_logs import create_audit_log
from app.services.exports import generate_symptoms_csv

router = APIRouter()


@router.post("/csv")
def export_csv(
    from_: datetime | None = None,
    to: datetime | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    csv_content = generate_symptoms_csv(
        db=db,
        user_id=current_user.id,
        date_from=from_,
        date_to=to,
        category=category,
    )

    create_audit_log(
        db=db,
        action="export_csv",
        user_id=current_user.id,
        metadata_json={
            "from_": from_.isoformat() if from_ else None,
            "to": to.isoformat() if to else None,
            "category": category,
        },
    )

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="symptoms_export.csv"'
        },
    )