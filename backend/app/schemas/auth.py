from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    password: str = Field(..., min_length=6)
    language: Literal["RU", "KZ"] = "RU"
    referral_code: str | None = None


class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str  # user_id
    exp: int | None = None


class UserRead(BaseModel):
    id: str
    username: str
    referral_code: str
    language: str
    created_at: datetime

    model_config = {"from_attributes": True}
