from pydantic import BaseModel
from typing import List, Optional, Any

class CartItemSchema(BaseModel):
    id: int
    title: str
    price: float
    qty: int
    image: str

class OrderCreate(BaseModel):
    items: List[CartItemSchema]
    totalPrice: float
    address: Any
    paymentMethod: Optional[str] = "upi"

class OrderOut(BaseModel):
    id: str
    total_price: float
    status: str
    step: int
    payment_method: str
    items_json: str
    address_json: str
    created_at: Any

    class Config:
        from_attributes = True
