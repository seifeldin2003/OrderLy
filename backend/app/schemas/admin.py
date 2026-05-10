from pydantic import BaseModel

# Schema for the Admin Dashboard statistics
class DashboardResponse(BaseModel):
    total_orders: int
    pending_orders: int
    revenue: float
    available_menu_items: int

# Schema for the Admin updating an order's status
class OrderStatusUpdate(BaseModel):
    status: str