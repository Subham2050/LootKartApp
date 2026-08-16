from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    title: str
    price: float
    description: Optional[str] = None
    category: str
    image: str
    rating_rate: Optional[float] = 4.5
    rating_count: Optional[int] = 100
    stock_count: Optional[int] = 10

class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True
