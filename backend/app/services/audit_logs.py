from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    action: str,
    user_id=None,
    metadata_json: dict | None = None,
) -> AuditLog:
    log = AuditLog(
        action=action,
        user_id=user_id,
        metadata_json=metadata_json,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log