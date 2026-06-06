from abc import ABC, abstractmethod
from typing import Any

class BaseThreatProvider(ABC):
    name: str = "base"

    @abstractmethod
    async def check_ip(self, ip: str) -> dict[str, Any]:
        ...

    @abstractmethod
    async def check_domain(self, domain: str) -> dict[str, Any]:
        ...

    @abstractmethod
    async def check_url(self, url: str) -> dict[str, Any]:
        ...

    @abstractmethod
    async def check_hash(self, sha256: str) -> dict[str, Any]:
        ...

    def _not_supported(self) -> dict:
        return {"supported": False, "error": f"{self.name} does not support this IOC type"}