from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class OrderCreate(BaseModel):
    delivery_address: str
    phone: str
    payment_method: str
    promo_code: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    item_name_snapshot: str
    item_price_snapshot: float
    quantity: int
    special_instructions: Optional[str] = None
    line_total: float

    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: int
    user_id: int
    order_number: str
    customer_name: Optional[str] = None
    status: str
    subtotal: float
    discount: float
    delivery_fee: float
    total: float
    delivery_address: str
    phone: str
    payment_method: str
    payment_status: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
