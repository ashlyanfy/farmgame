from pydantic import BaseModel


class MarketProductRead(BaseModel):
    product: str
    price_per_kg: int
    available_g: int
    description: str
