from sqlalchemy import ForeignKey, BigInteger, Integer, String, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class FarmState(Base):
    __tablename__ = "farm_states"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    active_culture: Mapped[str] = mapped_column(
        SAEnum("carrot", "apple", name="farm_culture_enum"), nullable=False, default="carrot"
    )
    carrot_start_ms: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    carrot_care_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    carrot_nutrients_used: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    apple_start_ms: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    apple_care_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    apple_nutrients_used: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    user: Mapped["User"] = relationship("User", back_populates="farm_state")
