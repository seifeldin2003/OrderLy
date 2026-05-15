from fastapi import APIRouter
from app.api.routes import admin, auth, cart, menu, orders

# Create main router
router = APIRouter()

router.include_router(auth.router, prefix="/api/auth", tags=["auth"])
router.include_router(menu.router, prefix="/api/menu", tags=["menu"])
router.include_router(cart.router, prefix="/api/cart", tags=["cart"])
router.include_router(orders.router, prefix="/api/orders", tags=["orders"])
router.include_router(admin.router, prefix="/api/admin", tags=["admin"])

# Temporary endpoint for testing
@router.get("/")
def root():
    """Root endpoint."""
    return {"message": "Welcome to Customer Ordering System API"}
