from pydantic import BaseModel
from typing import Any

class SourceResult(BaseModel):
    source: str
    supported: bool = True
    error: str | None = None

class ThreatResponse(BaseModel):
    ioc_type: str
    ioc_value: str
    risk_score: int
    classification: str  # LOW, MEDIUM, HIGH, CRITICAL
    sources: list[dict[str, Any]]
    from_cache: bool