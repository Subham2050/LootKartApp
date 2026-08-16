from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.product import ProductModel
from app.schemas.product import ProductOut

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductOut])
def get_products(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ProductModel)
    if category and category.lower() != "all":
        query = query.filter(ProductModel.category.ilike(f"%{category}%"))
    return query.all()

@router.get("/{product_id}", response_model=ProductOut)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    prod = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod
