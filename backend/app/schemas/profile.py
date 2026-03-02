from datetime import datetime

from pydantic import BaseModel


class ProfileRead(BaseModel):
    id: str
    username: str
    referral_code: str
    language: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    username: str | None = None
    language: str | None = None


class DeliveryProfileRead(BaseModel):
    fio: str | None
    phone: str | None
    city: str | None
    address: str | None
    comment: str | None

    model_config = {"from_attributes": True}


class DeliveryProfileUpdate(BaseModel):
    fio: str | None = None
    phone: str | None = None
    city: str | None = None
    address: str | None = None
    comment: str | None = None
