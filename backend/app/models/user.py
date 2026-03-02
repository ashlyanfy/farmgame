import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    referral_code: Mapped[str] = mapped_column(
        String(16), unique=True, nullable=False, default=lambda: str(uuid.uuid4())[:8].upper()
    )
    language: Mapped[str] = mapped_column(
        SAEnum("RU", "KZ", name="language_enum"), nullable=False, default="RU"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    wallet: Mapped["Wallet"] = relationship("Wallet", back_populates="user", uselist=False)
    goodness: Mapped["Goodness"] = relationship("Goodness", back_populates="user", uselist=False)
    farm_state: Mapped["FarmState"] = relationship("FarmState", back_populates="user", uselist=False)
    fish_state: Mapped["FishState"] = relationship("FishState", back_populates="user", uselist=False)
    bee_state: Mapped["BeeState"] = relationship("BeeState", back_populates="user", uselist=False)
    inventory: Mapped[list["Inventory"]] = relationship("Inventory", back_populates="user")
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="user")
    delivery_profile: Mapped["DeliveryProfile"] = relationship(
        "DeliveryProfile", back_populates="user", uselist=False
    )
