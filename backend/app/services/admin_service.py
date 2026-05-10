from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import menu_repository, order_repository
from app.schemas.admin import OrderStatusUpdate
from app.schemas.menu import MenuItemCreate, MenuItemUpdate
from app.services.menu_service import create_menu_item, disable_menu_item, update_menu_item

VALID_ORDER_STATUSES = {"Pending", "Confirmed", "Preparing", "Ready", "OutForDelivery", "Delivered", "Cancelled"}


def get_dashboard_stats(db: Session) -> dict:
    orders = order_repository.list_all_orders(db)
    menu_items = menu_repository.list_items(db)
    return {
        "total_orders": len(orders),
        "pending_orders": len([order for order in orders if order.status == "Pending"]),
        "revenue": round(sum(order.total for order in orders if order.status != "Cancelled"), 2),
        "available_menu_items": len([item for item in menu_items if item.available]),
    }


def list_orders(db: Session):
    orders = order_repository.list_all_orders(db)
    for order in orders:
        if getattr(order, "user", None):
            order.customer_name = order.user.full_name
    return orders


def update_order_status(db: Session, order_id: int, payload: OrderStatusUpdate):
    if payload.status not in VALID_ORDER_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order status")
    order = order_repository.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order.status = payload.status
    saved = order_repository.save_order(db, order)
    if getattr(saved, "user", None):
        saved.customer_name = saved.user.full_name
    return saved


def list_menu_items(db: Session):
    return menu_repository.list_items(db)


def create_admin_menu_item(db: Session, payload: MenuItemCreate):
    return create_menu_item(db, payload)


def update_admin_menu_item(db: Session, item_id: int, payload: MenuItemUpdate):
    return update_menu_item(db, item_id, payload)


def delete_admin_menu_item(db: Session, item_id: int):
    return disable_menu_item(db, item_id)
