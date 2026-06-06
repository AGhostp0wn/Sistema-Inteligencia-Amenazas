from fastapi import APIRouter, Depends
from app.services.threat_service import analyze
from app.security import verify_token
router = APIRouter()

@router.get("/url/{url:path}")
async def check_url(url: str, token_data=Depends(verify_token)):
    return await analyze("url", url)