from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_admin_user, get_db
from app.models.user import User
from app.schemas.admin import DashboardResponse, OrderStatusUpdate
from app.schemas.menu import MenuItemCreate, MenuItemResponse, MenuItemUpdate
from app.schemas.order import OrderResponse
from app.services import admin_service

router = APIRouter()


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(_: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return admin_service.get_dashboard_stats(db)


@router.get("/orders", response_model=list[OrderResponse])
def orders(_: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return admin_service.list_orders(db)


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: int, payload: OrderStatusUpdate, _: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return admin_service.update_order_status(db, order_id, payload)


@router.get("/menu", response_model=list[MenuItemResponse])
def menu(_: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return admin_service.list_menu_items(db)


@router.post("/menu", response_model=MenuItemResponse, status_code=201)
def create_menu_item(payload: MenuItemCreate, _: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return admin_service.create_admin_menu_item(db, payload)


@router.put("/menu/{item_id}", response_model=MenuItemResponse)
def update_menu_item(item_id: int, payload: MenuItemUpdate, _: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return admin_service.update_admin_menu_item(db, item_id, payload)


@router.delete("/menu/{item_id}", response_model=MenuItemResponse)
def delete_menu_item(item_id: int, _: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return admin_service.delete_admin_menu_item(db, item_id)
