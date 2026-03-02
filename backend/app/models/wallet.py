from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Wallet(Base):
    __tablename__ = "wallets"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    coins: Mapped[int] = mapped_column(Integer, nullable=False, default=500)
    water_g: Mapped[int] = mapped_column(Integer, nullable=False, default=1000)
    oxygen_g: Mapped[int] = mapped_column(Integer, nullable=False, default=1000)
    syrup_g: Mapped[int] = mapped_column(Integer, nullable=False, default=1000)
    nutrients: Mapped[int] = mapped_column(Integer, nullable=False, default=5)

    user: Mapped["User"] = relationship("User", back_populates="wallet")
