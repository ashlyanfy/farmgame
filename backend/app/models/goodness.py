from datetime import date
from sqlalchemy import ForeignKey, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Goodness(Base):
    __tablename__ = "goodness"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    value: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    goal: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    level: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    today_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    today_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)

    user: Mapped["User"] = relationship("User", back_populates="goodness")
