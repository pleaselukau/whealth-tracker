from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.api.deps import get_db
from app.schemas.symptom import SymptomCreate, SymptomResponse, SymptomUpdate
from app.services.audit_logs import create_audit_log
from app.services.symptoms import (
    create_symptom,
    delete_symptom,
    get_symptom_by_id,
    list_symptoms,
    update_symptom,
)

router = APIRouter()


def to_response(symptom) -> SymptomResponse:
    return SymptomResponse(
        id=str(symptom.id),
        user_id=str(symptom.user_id),
        date_time=symptom.date_time,
        category=symptom.category,
        severity=symptom.severity,
        notes=symptom.notes,
        tags=symptom.tags,
        created_at=symptom.created_at,
    )


@router.post("", response_model=SymptomResponse, status_code=201)
def create_symptom_entry(
    payload: SymptomCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    symptom = create_symptom(
        db=db,
        user_id=current_user.id,
        date_time=payload.date_time,
        category=payload.category,
        severity=payload.severity,
        notes=payload.notes,
        tags=payload.tags,
    )

    create_audit_log(
        db=db,
        action="symptom_create",
        user_id=current_user.id,
        metadata_json={"symptom_id": str(symptom.id), "category": symptom.category},
    )

    return to_response(symptom)


@router.get("", response_model=list[SymptomResponse])
def list_user_symptoms(
    from_: datetime | None = None,
    to: datetime | None = None,
    category: str | None = None,
    severity: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    symptoms = list_symptoms(
        db=db,
        user_id=current_user.id,
        date_from=from_,
        date_to=to,
        category=category,
        severity=severity,
    )
    return [to_response(symptom) for symptom in symptoms]


@router.get("/{symptom_id}", response_model=SymptomResponse)
def get_symptom(
    symptom_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    symptom = get_symptom_by_id(db=db, symptom_id=symptom_id, user_id=current_user.id)
    if not symptom:
        raise HTTPException(status_code=404, detail="Symptom not found")
    return to_response(symptom)


@router.put("/{symptom_id}", response_model=SymptomResponse)
def update_symptom_entry(
    symptom_id: UUID,
    payload: SymptomUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    symptom = get_symptom_by_id(db=db, symptom_id=symptom_id, user_id=current_user.id)
    if not symptom:
        raise HTTPException(status_code=404, detail="Symptom not found")

    updated = update_symptom(
        db=db,
        symptom=symptom,
        date_time=payload.date_time,
        category=payload.category,
        severity=payload.severity,
        notes=payload.notes,
        tags=payload.tags,
    )

    create_audit_log(
        db=db,
        action="symptom_update",
        user_id=current_user.id,
        metadata_json={"symptom_id": str(updated.id)},
    )

    return to_response(updated)


@router.delete("/{symptom_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_symptom_entry(
    symptom_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    symptom = get_symptom_by_id(db=db, symptom_id=symptom_id, user_id=current_user.id)
    if not symptom:
        raise HTTPException(status_code=404, detail="Symptom not found")

    create_audit_log(
        db=db,
        action="symptom_delete",
        user_id=current_user.id,
        metadata_json={"symptom_id": str(symptom.id)},
    )

    delete_symptom(db=db, symptom=symptom)