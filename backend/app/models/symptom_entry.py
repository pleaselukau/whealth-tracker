import uuid
from sqlalchemy import DateTime, ForeignKey, Integer, Text, func, Index
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SymptomEntry(Base):
    __tablename__ = "symptom_entries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    date_time: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    category: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags: Mapped[object | None] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="symptom_entries")

    __table_args__ = (
        Index("ix_symptom_entries_user_id_date_time", "user_id", "date_time"),
    )