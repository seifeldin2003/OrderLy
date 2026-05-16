from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import cart_repository, menu_repository
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse


def _cart_response(cart) -> CartResponse:
    subtotal = sum(item.menu_item.price * item.quantity for item in cart.items if item.menu_item)
    return CartResponse.model_validate(
        {
            "id": cart.id,
            "user_id": cart.user_id,
            "items": cart.items,
            "subtotal": subtotal,
            "discount": 0.0,
            "delivery_fee": 0.0,
            "total": subtotal,
        },
        from_attributes=True,
    )


def get_cart(db: Session, user_id: int) -> CartResponse:
    return _cart_response(cart_repository.get_or_create_cart(db, user_id))


def add_item(db: Session, user_id: int, payload: CartItemCreate) -> CartResponse:
    if payload.quantity <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity must be greater than zero")

    menu_item = menu_repository.get_item(db, payload.menu_item_id)
    if not menu_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    if not menu_item.available:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Menu item is not available")
    if menu_item.stock < payload.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock")

    cart = cart_repository.get_or_create_cart(db, user_id)
    existing = cart_repository.find_matching_item(
        db,
        cart.id,
        payload.menu_item_id,
        payload.special_instructions,
    )
    if existing:
        new_quantity = existing.quantity + payload.quantity
        if menu_item.stock < new_quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock")
        existing.quantity = new_quantity
        cart_repository.save_cart_item(db, existing)
    else:
        cart_repository.add_cart_item(
            db,
            cart_id=cart.id,
            menu_item_id=payload.menu_item_id,
            quantity=payload.quantity,
            special_instructions=payload.special_instructions,
        )
    return get_cart(db, user_id)


def update_item(db: Session, user_id: int, cart_item_id: int, payload: CartItemUpdate) -> CartResponse:
    if payload.quantity <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity must be greater than zero")

    cart = cart_repository.get_or_create_cart(db, user_id)
    item = cart_repository.get_cart_item(db, cart.id, cart_item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    if item.menu_item.stock < payload.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock")

    item.quantity = payload.quantity
    if "special_instructions" in payload.model_fields_set:
        item.special_instructions = payload.special_instructions
    cart_repository.save_cart_item(db, item)
    return get_cart(db, user_id)


def remove_item(db: Session, user_id: int, cart_item_id: int) -> CartResponse:
    cart = cart_repository.get_or_create_cart(db, user_id)
    item = cart_repository.get_cart_item(db, cart.id, cart_item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    cart_repository.delete_cart_item(db, item)
    return get_cart(db, user_id)


def clear_user_cart(db: Session, user_id: int) -> CartResponse:
    cart = cart_repository.get_or_create_cart(db, user_id)
    cart_repository.clear_cart(db, cart)
    return get_cart(db, user_id)
