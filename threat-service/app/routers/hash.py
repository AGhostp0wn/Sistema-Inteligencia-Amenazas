from fastapi import APIRouter, Depends
from app.services.threat_service import analyze
from app.security import verify_token
router = APIRouter()

@router.get("/hash/{sha256}")
async def check_hash(sha256: str, token_data=Depends(verify_token)):
    return await analyze("hash", sha256)