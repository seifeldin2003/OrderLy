from sqlalchemy.orm import Session, joinedload
from app.models.order import Order, OrderItem


def create_order(db: Session, order: Order, order_items: list[OrderItem]) -> Order:
    db.add(order)
    db.flush()
    for item in order_items:
        item.order_id = order.id
        db.add(item)
    db.commit()
    db.refresh(order)
    return order


def list_user_orders(db: Session, user_id: int) -> list[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.user))
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_user_order(db: Session, user_id: int, order_id: int) -> Order | None:
    return (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.user))
        .filter(Order.user_id == user_id, Order.id == order_id)
        .first()
    )


def list_all_orders(db: Session) -> list[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.user))
        .order_by(Order.created_at.desc())
        .all()
    )


def get_order(db: Session, order_id: int) -> Order | None:
    return (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.user))
        .filter(Order.id == order_id)
        .first()
    )


def save_order(db: Session, order: Order) -> Order:
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
