from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class ProgressInfo(BaseModel):
    percent: int
    days_left: int


class FarmStateRead(BaseModel):
    active_culture: str
    carrot_start_ms: int
    carrot_care_index: int
    carrot_nutrients_used: int
    carrot_progress: ProgressInfo
    apple_start_ms: int
    apple_care_index: int
    apple_nutrients_used: int
    apple_progress: ProgressInfo

    model_config = {"from_attributes": True}


class FishStateRead(BaseModel):
    cycle_start_ms: int
    care_index: int
    nutrients_used: int
    progress: ProgressInfo

    model_config = {"from_attributes": True}


class BeeStateRead(BaseModel):
    cycle_start_ms: int
    care_index: int
    nutrients_used: int
    progress: ProgressInfo

    model_config = {"from_attributes": True}


class InventoryItemRead(BaseModel):
    id: str
    product: str
    weight_g: int
    quality: int
    collected_at: datetime

    model_config = {"from_attributes": True}


class SwitchCultureRequest(BaseModel):
    culture: Literal["carrot", "apple"]
