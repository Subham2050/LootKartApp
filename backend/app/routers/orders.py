import json
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, Header, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_optional
from app.models.order import OrderModel
from app.schemas.order import OrderCreate, OrderOut
from app.middleware.idempotency import check_idempotency, save_idempotency

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", status_code=status.HTTP_201_CREATED)
def place_order(
    order_in: OrderCreate,
    request: Request,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
    db: Session = Depends(get_db),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    # 1. Redis Idempotency Check
    if idempotency_key:
        cached_response = check_idempotency(idempotency_key)
        if cached_response:
            cached_response["is_duplicate_retry"] = True
            return cached_response

    # 2. Generate unique Order ID
    order_id = f"LK-{random.randint(100000, 999999)}"

    # 3. Create Order Record in SQLite DB
    user_id = int(current_user["sub"]) if current_user and "sub" in current_user else None
    user_email = current_user.get("email") if current_user else None

    items_dict = [item.dict() for item in order_in.items]
    
    db_order = OrderModel(
        id=order_id,
        user_id=user_id,
        user_email=user_email,
        items_json=json.dumps(items_dict),
        total_price=order_in.totalPrice,
        address_json=json.dumps(order_in.address if isinstance(order_in.address, dict) else str(order_in.address)),
        payment_method=order_in.paymentMethod or "upi",
        status="In Transit",
        step=2,
        idempotency_key=idempotency_key
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    response_payload = {
        "id": db_order.id,
        "total_price": db_order.total_price,
        "status": db_order.status,
        "step": db_order.step,
        "payment_method": db_order.payment_method,
        "items": items_dict,
        "idempotency_key": idempotency_key,
        "created_at": db_order.created_at.isoformat(),
        "is_duplicate_retry": False
    }

    # 4. Save Response in Redis for 24-hour Idempotency window
    if idempotency_key:
        save_idempotency(idempotency_key, response_payload)

    return response_payload

@router.get("", response_model=List[OrderOut])
def get_user_orders(
    db: Session = Depends(get_db),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    query = db.query(OrderModel)
    if current_user and "sub" in current_user:
        query = query.filter(OrderModel.user_id == int(current_user["sub"]))
    return query.order_by(OrderModel.created_at.desc()).all()
