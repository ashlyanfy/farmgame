from sqlalchemy import ForeignKey, BigInteger, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class BeeState(Base):
    __tablename__ = "bee_states"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    cycle_start_ms: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    care_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    nutrients_used: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    user: Mapped["User"] = relationship("User", back_populates="bee_state")
