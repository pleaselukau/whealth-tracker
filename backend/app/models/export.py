import uuid
from sqlalchemy import DateTime, ForeignKey, Text, func, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Export(Base):
    __tablename__ = "exports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    type: Mapped[str] = mapped_column(Text, nullable=False)  # "csv"
    storage_key: Mapped[str] = mapped_column(Text, nullable=False)

    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    expires_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="exports")

    __table_args__ = (
        Index("ix_exports_user_id_created_at", "user_id", "created_at"),
    )