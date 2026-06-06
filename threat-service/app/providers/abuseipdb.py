import httpx
from app.config import settings
from app.providers.base import BaseThreatProvider

TIMEOUT = httpx.Timeout(10.0)

class AbuseIPDBProvider(BaseThreatProvider):
    name = "abuseipdb"
    BASE_URL = "https://api.abuseipdb.com/api/v2"

    async def check_ip(self, ip: str) -> dict:
        # Aquí 'settings.abuseipdb_api_key' ya lee directamente del .env
        headers = {"Key": settings.abuseipdb_api_key, "Accept": "application/json"}
        params = {"ipAddress": ip, "maxAgeInDays": 90, "verbose": True}
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                r = await client.get(f"{self.BASE_URL}/check", headers=headers, params=params)
                r.raise_for_status()
                data = r.json()["data"]
                return {
                    "source": self.name,
                    "supported": True,
                    "abuse_score": data.get("abuseConfidenceScore", 0),
                    "total_reports": data.get("totalReports", 0),
                    "country": data.get("countryCode"),
                    "isp": data.get("isp"),
                    "is_tor": data.get("isTor", False),
                    "raw": data,
                }
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                return {"source": self.name, "supported": True, "error": "rate_limit"}
            return {"source": self.name, "supported": True, "error": str(e)}
        except Exception as e:
            return {"source": self.name, "supported": True, "error": str(e)}

    async def check_domain(self, domain: str) -> dict:
        return self._not_supported()

    async def check_url(self, url: str) -> dict:
        return self._not_supported()

    async def check_hash(self, sha256: str) -> dict:
        return self._not_supported()