from fastapi import APIRouter

router = APIRouter(prefix="/menu")

@router.get("/")
def get_menu():
    return []
