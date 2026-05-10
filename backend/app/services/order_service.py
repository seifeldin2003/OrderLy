from datetime import datetime
from random import randint
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem
from app.repositories import cart_repository, menu_repository, order_repository
from app.schemas.order import OrderCreate

DELIVERY_FEE = 3.0
VALID_PAYMENT_METHODS = {"CashOnDelivery", "Card", "Wallet"}
CANCELABLE_STATUSES = {"Pending", "Confirmed"}


def _order_response(order: Order) -> Order:
    if getattr(order, "user", None):
        order.customer_name = order.user.full_name
    return order


def _generate_order_number() -> str:
    return f"ORD-{datetime.now().strftime('%Y%m%d')}-{randint(1000, 9999)}"


def create_order_from_cart(db: Session, user_id: int, payload: OrderCreate) -> Order:
    if payload.payment_method not in VALID_PAYMENT_METHODS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payment method")

    cart = cart_repository.get_or_create_cart(db, user_id)
    if not cart.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart cannot be empty")

    subtotal = 0.0
    order_items: list[OrderItem] = []
    for cart_item in cart.items:
        menu_item = menu_repository.get_item(db, cart_item.menu_item_id)
        if not menu_item or not menu_item.available:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Menu item {cart_item.menu_item_id} is not available")
        if menu_item.stock < cart_item.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Not enough stock for {menu_item.name}")

        line_total = menu_item.price * cart_item.quantity
        subtotal += line_total
        order_items.append(
            OrderItem(
                menu_item_id=menu_item.id,
                item_name_snapshot=menu_item.name,
                item_price_snapshot=menu_item.price,
                quantity=cart_item.quantity,
                special_instructions=cart_item.special_instructions,
                line_total=line_total,
            )
        )
        menu_item.stock -= cart_item.quantity

    discount = round(subtotal * 0.10, 2) if payload.promo_code and payload.promo_code.upper() == "SAVE10" else 0.0
    total = round(subtotal - discount + DELIVERY_FEE, 2)
    payment_status = "Pending" if payload.payment_method == "CashOnDelivery" else "Paid"

    order = Order(
        user_id=user_id,
        order_number=_generate_order_number(),
        status="Pending",
        subtotal=round(subtotal, 2),
        discount=discount,
        delivery_fee=DELIVERY_FEE,
        total=total,
        delivery_address=payload.delivery_address,
        phone=payload.phone,
        payment_method=payload.payment_method,
        payment_status=payment_status,
    )

    created = order_repository.create_order(db, order, order_items)
    cart_repository.clear_cart(db, cart)
    return _order_response(created)


def list_orders(db: Session, user_id: int) -> list[Order]:
    return [_order_response(order) for order in order_repository.list_user_orders(db, user_id)]


def get_order(db: Session, user_id: int, order_id: int) -> Order:
    order = order_repository.get_user_order(db, user_id, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return _order_response(order)


def cancel_order(db: Session, user_id: int, order_id: int) -> Order:
    order = get_order(db, user_id, order_id)
    if order.status not in CANCELABLE_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order can no longer be cancelled")
    order.status = "Cancelled"
    return _order_response(order_repository.save_order(db, order))
