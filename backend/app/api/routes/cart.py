from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_customer_user, get_db
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse
from app.services import cart_service

router = APIRouter()


@router.get("", response_model=CartResponse)
def get_cart(current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    return cart_service.get_cart(db, current_user.id)


@router.post("/items", response_model=CartResponse, status_code=201)
def add_item(payload: CartItemCreate, current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    return cart_service.add_item(db, current_user.id, payload)


@router.put("/items/{cart_item_id}", response_model=CartResponse)
def update_item(cart_item_id: int, payload: CartItemUpdate, current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    return cart_service.update_item(db, current_user.id, cart_item_id, payload)


@router.delete("/items/{cart_item_id}", response_model=CartResponse)
def delete_item(cart_item_id: int, current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    return cart_service.remove_item(db, current_user.id, cart_item_id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(current_user: User = Depends(get_current_customer_user), db: Session = Depends(get_db)):
    cart_service.clear_user_cart(db, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
