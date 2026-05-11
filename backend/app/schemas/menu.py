from sqlalchemy.orm import Session
from app.models.menu_item import MenuItem
from app.schemas.menu import MenuItemCreate, MenuItemUpdate


def list_items(
    db: Session,
    *,
    category: str | None = None,
    search: str | None = None,
    available: bool | None = None,
) -> list[MenuItem]:
    query = db.query(MenuItem)
    if category:
        query = query.filter(MenuItem.category == category)
    if search:
        like = f"%{search}%"
        query = query.filter(MenuItem.name.ilike(like) | MenuItem.description.ilike(like))
    if available is not None:
        query = query.filter(MenuItem.available == available)
    return query.order_by(MenuItem.category, MenuItem.name).all()


def get_item(db: Session, item_id: int) -> MenuItem | None:
    return db.query(MenuItem).filter(MenuItem.id == item_id).first()


def create_item(db: Session, payload: MenuItemCreate) -> MenuItem:
    item = MenuItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_item(db: Session, item: MenuItem, payload: MenuItemUpdate) -> MenuItem:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def save_item(db: Session, item: MenuItem) -> MenuItem:
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
