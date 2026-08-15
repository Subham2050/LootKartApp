import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from app.core.database import Base

class ProductModel(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), index=True, nullable=False)
    image = Column(String(500), nullable=False)
    rating_rate = Column(Float, default=4.5)
    rating_count = Column(Integer, default=100)
    stock_count = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
