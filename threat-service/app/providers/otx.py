import httpx
from app.config import settings
from app.providers.base import BaseThreatProvider

TIMEOUT = httpx.Timeout(10.0)

class OTXProvider(BaseThreatProvider):
    name = "otx"
    BASE_URL = "https://otx.alienvault.com/api/v1/indicators"

    async def _query(self, ioc_type: str, value: str, section: str) -> dict:
        headers = {"X-OTX-API-KEY": settings.otx_api_key}
        url = f"{self.BASE_URL}/{ioc_type}/{value}/{section}"
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                r = await client.get(url, headers=headers)
                r.raise_for_status()
                return r.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                return {"error": "rate_limit"}
            return {"error": str(e)}
        except Exception as e:
            return {"error": str(e)}

    async def check_ip(self, ip: str) -> dict:
        data = await self._query("IPv4", ip, "general")
        if "error" in data:
            return {"source": self.name, "supported": True, **data}
        return {
            "source": self.name,
            "supported": True,
            "pulse_count": data.get("pulse_info", {}).get("count", 0),
            "reputation": data.get("reputation", 0),
            "country": data.get("country_name"),
            "asn": data.get("asn"),
        }

    async def check_domain(self, domain: str) -> dict:
        data = await self._query("domain", domain, "general")
        if "error" in data:
            return {"source": self.name, "supported": True, **data}
        return {
            "source": self.name,
            "supported": True,
            "pulse_count": data.get("pulse_info", {}).get("count", 0),
            "alexa": data.get("alexa"),
            "whois": data.get("whois"),
        }

    async def check_url(self, url: str) -> dict:
        import base64
        encoded = base64.b64encode(url.encode()).decode()
        data = await self._query("url", encoded, "general")
        if "error" in data:
            return {"source": self.name, "supported": True, **data}
        return {
            "source": self.name,
            "supported": True,
            "pulse_count": data.get("pulse_info", {}).get("count", 0),
        }

    async def check_hash(self, sha256: str) -> dict:
        data = await self._query("file", sha256, "general")
        if "error" in data:
            return {"source": self.name, "supported": True, **data}
        return {
            "source": self.name,
            "supported": True,
            "pulse_count": data.get("pulse_info", {}).get("count", 0),
            "malware_families": data.get("malware_families", []),
        }