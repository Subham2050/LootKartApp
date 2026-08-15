import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from app.core.database import Base

class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String(150), nullable=True)
    items_json = Column(Text, nullable=False)
    total_price = Column(Float, nullable=False)
    address_json = Column(Text, nullable=False)
    payment_method = Column(String(50), default="upi")
    status = Column(String(50), default="In Transit")
    step = Column(Integer, default=2)
    idempotency_key = Column(String(100), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
