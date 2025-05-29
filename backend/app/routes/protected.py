from fastapi import APIRouter, Depends
from app.deps import get_current_user

router = APIRouter()

@router.get("/api/protected")
def protected(user_id: str = Depends(get_current_user)):
    return {"message": f"Dette er en beskyttet rute. Bruker-ID: {user_id}"}
