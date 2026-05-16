from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.schemas.menu import MenuItemResponse
from app.services import menu_service

router = APIRouter()


@router.get("/items", response_model=list[MenuItemResponse])
def get_items(
    category: str | None = None,
    search: str | None = None,
    available: bool | None = Query(default=True),
    db: Session = Depends(get_db),
):
    return menu_service.get_menu_items(db, category, search, available)


@router.get("/items/{item_id}", response_model=MenuItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return menu_service.get_menu_item(db, item_id)
