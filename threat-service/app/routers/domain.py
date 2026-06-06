from fastapi import APIRouter, Depends
from app.services.threat_service import analyze
from app.security import verify_token
router = APIRouter()

@router.get("/domain/{domain}")
async def check_domain(domain: str, token_data=Depends(verify_token)):
    return await analyze("domain", domain)