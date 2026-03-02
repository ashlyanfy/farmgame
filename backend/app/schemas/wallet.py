from typing import Literal

from pydantic import BaseModel


class WalletRead(BaseModel):
    coins: int
    water_g: int
    oxygen_g: int
    syrup_g: int
    nutrients: int

    model_config = {"from_attributes": True}


class CareRequest(BaseModel):
    tab: Literal["farm", "fish", "bee"]


class NutrientRequest(BaseModel):
    tab: Literal["farm", "fish", "bee"]
