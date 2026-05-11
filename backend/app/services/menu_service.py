from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import menu_repository
from app.schemas.menu import MenuItemCreate, MenuItemUpdate

VALID_CATEGORIES = {"Pizza", "Burgers", "Pasta", "Drinks", "Desserts"}


def get_menu_items(db: Session, category: str | None, search: str | None, available: bool | None):
    if category and category not in VALID_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid menu category")
    return menu_repository.list_items(db, category=category, search=search, available=available)


def get_menu_item(db: Session, item_id: int):
    item = menu_repository.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    return item


def create_menu_item(db: Session, payload: MenuItemCreate):
    if payload.category not in VALID_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid menu category")
    return menu_repository.create_item(db, payload)


def update_menu_item(db: Session, item_id: int, payload: MenuItemUpdate):
    item = get_menu_item(db, item_id)
    if payload.category is not None and payload.category not in VALID_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid menu category")
    return menu_repository.update_item(db, item, payload)


def disable_menu_item(db: Session, item_id: int):
    item = get_menu_item(db, item_id)
    item.available = False
    return menu_repository.save_item(db, item)
