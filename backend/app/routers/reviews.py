from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.review import ReviewModel
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("/{product_id}", response_model=List[ReviewOut])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    return db.query(ReviewModel).filter(ReviewModel.product_id == product_id).order_by(ReviewModel.created_at.desc()).all()

@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_product_review(review_in: ReviewCreate, db: Session = Depends(get_db)):
    db_review = ReviewModel(
        product_id=review_in.product_id,
        user_name=review_in.user_name,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
