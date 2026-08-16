from pydantic import BaseModel
from typing import Any

class ReviewCreate(BaseModel):
    product_id: int
    user_name: str
    rating: int
    comment: str

class ReviewOut(BaseModel):
    id: int
    product_id: int
    user_name: str
    rating: int
    comment: str
    created_at: Any

    class Config:
        from_attributes = True
