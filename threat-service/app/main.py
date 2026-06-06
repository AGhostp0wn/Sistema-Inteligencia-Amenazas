from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ip, domain, url, hash

app = FastAPI(title="ThreatGuard AI - Threat Service", version="1.0.0")

# CORS — permite el frontend en desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ip.router,     prefix="/threat", tags=["IP"])
app.include_router(domain.router, prefix="/threat", tags=["Domain"])
app.include_router(url.router,    prefix="/threat", tags=["URL"])
app.include_router(hash.router,   prefix="/threat", tags=["Hash"])

@app.get("/health")
async def health():
    return {"status": "ok"}