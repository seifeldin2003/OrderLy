from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MenuItemBase(BaseModel):
    name: str
    category: str
    description: str
    price: float
    image_url: Optional[str] = None
    stock: int = 0
    available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None
    available: Optional[bool] = None

class MenuItemResponse(MenuItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)