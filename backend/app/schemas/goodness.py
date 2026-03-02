from pydantic import BaseModel


class GoodnessRead(BaseModel):
    value: int
    goal: int
    level: int

    model_config = {"from_attributes": True}
