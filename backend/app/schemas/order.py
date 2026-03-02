from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    product: Literal["carrot", "apple", "trout", "honey"]
    weight_g: int


class OrderItemRead(BaseModel):
    product: str
    weight_g: int

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]


class OrderRead(BaseModel):
    id: str
    status: str
    created_at: datetime
    items: list[OrderItemRead]

    model_config = {"from_attributes": True}
