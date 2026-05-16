from fastapi import APIRouter

router = APIRouter(prefix="/orders")

@router.get("/")
def get_orders():
    return []
