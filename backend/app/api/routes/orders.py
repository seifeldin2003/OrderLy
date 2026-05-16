from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_customer_user, get_db
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse
from app.services import order_service

router = APIRouter()


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(payload: OrderCreate, current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    return order_service.create_order_from_cart(db, current_user.id, payload)


@router.get("", response_model=list[OrderResponse])
def get_orders(current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    return order_service.list_orders(db, current_user.id)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    return order_service.get_order(db, current_user.id, order_id)


@router.put("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: int, current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    return order_service.cancel_order(db, current_user.id, order_id)
