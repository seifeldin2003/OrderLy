from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from app.schemas.menu import MenuItemResponse

class CartItemCreate(BaseModel):
    menu_item_id: int
    quantity: int
    special_instructions: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: int
    special_instructions: Optional[str] = None

class CartItemResponse(BaseModel):
    id: int
    cart_id: int
    menu_item_id: int
    quantity: int
    special_instructions: Optional[str] = None
    
    # Include the full menu item details so the frontend can display the name/picture
    menu_item: Optional[MenuItemResponse] = None

    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    id: int
    user_id: int
    items: List[CartItemResponse] = []
    subtotal: float = 0.0
    discount: float = 0.0
    delivery_fee: float = 0.0
    total: float = 0.0

    model_config = ConfigDict(from_attributes=True)
