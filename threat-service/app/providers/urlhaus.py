import httpx
from app.config import settings
from app.providers.base import BaseThreatProvider

TIMEOUT = httpx.Timeout(10.0)

class URLHausProvider(BaseThreatProvider):
    name = "urlhaus"
    BASE_URL = "https://urlhaus-api.abuse.ch/v1"

    async def check_ip(self, ip: str) -> dict:
        try:
            headers = {"Auth-Key": settings.urlhaus_api_key}
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                r = await client.post(
                    f"{self.BASE_URL}/host/",
                    data={"host": ip},
                    headers=headers
                )
                r.raise_for_status()
                data = r.json()
                return {
                    "source": self.name,
                    "supported": True,
                    "query_status": data.get("query_status"),
                    "url_count": len(data.get("urls", [])),
                }
        except Exception as e:
            return {"source": self.name, "supported": True, "error": str(e)}

    async def check_domain(self, domain: str) -> dict:
        try:
            headers = {"Auth-Key": settings.urlhaus_api_key}
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                r = await client.post(
                    f"{self.BASE_URL}/host/",
                    data={"host": domain},
                    headers=headers
                )
                r.raise_for_status()
                data = r.json()
                return {
                    "source": self.name,
                    "supported": True,
                    "query_status": data.get("query_status"),
                    "url_count": len(data.get("urls", [])),
                }
        except Exception as e:
            return {"source": self.name, "supported": True, "error": str(e)}

    async def check_url(self, url: str) -> dict:
        try:
            headers = {"Auth-Key": settings.urlhaus_api_key}
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                r = await client.post(
                    f"{self.BASE_URL}/url/",
                    data={"url": url},
                    headers=headers
                )
                r.raise_for_status()
                data = r.json()
                return {
                    "source": self.name,
                    "supported": True,
                    "query_status": data.get("query_status"),
                    "threat": data.get("threat"),
                    "url_status": data.get("url_status"),
                    "tags": data.get("tags", []),
                }
        except Exception as e:
            return {"source": self.name, "supported": True, "error": str(e)}

    async def check_hash(self, sha256: str) -> dict:
        try:
            headers = {"Auth-Key": settings.urlhaus_api_key}
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                r = await client.post(
                    f"{self.BASE_URL}/payload/",
                    data={"sha256_hash": sha256},
                    headers=headers
                )
                r.raise_for_status()
                data = r.json()
                return {
                    "source": self.name,
                    "supported": True,
                    "query_status": data.get("query_status"),
                    "file_type": data.get("file_type"),
                    "signature": data.get("signature"),
                }
        except Exception as e:
            return {"source": self.name, "supported": True, "error": str(e)}