from fastapi import APIRouter, Depends
from app.services.threat_service import analyze
from app.security import verify_token

router = APIRouter()

@router.get("/ip/{ip}")
async def check_ip(ip: str, token_data=Depends(verify_token)):
    return await analyze("ip", ip)