from pydantic import BaseModel


class GoodnessRead(BaseModel):
    value: int
    goal: int
    level: int
    today_count: int

    model_config = {"from_attributes": True}
