import asyncio
from app.providers.abuseipdb import AbuseIPDBProvider
from app.providers.otx import OTXProvider
from app.providers.urlhaus import URLHausProvider
from app.services.risk_score import RiskScoreCalculator
from app.cache.redis_client import cache_get, cache_set

abuseipdb = AbuseIPDBProvider()
otx = OTXProvider()
urlhaus = URLHausProvider()

async def analyze(ioc_type: str, value: str) -> dict:
    cache_key = f"threat:{ioc_type}:{value}"

    # 1. Cache hit?
    cached = await cache_get(cache_key)
    if cached:
        cached["from_cache"] = True
        return cached

    # 2. Consulta concurrente a los 3 providers
    method_map = {
        "ip":     [abuseipdb.check_ip, otx.check_ip, urlhaus.check_ip],
        "domain": [abuseipdb.check_domain, otx.check_domain, urlhaus.check_domain],
        "url":    [abuseipdb.check_url, otx.check_url, urlhaus.check_url],
        "hash":   [abuseipdb.check_hash, otx.check_hash, urlhaus.check_hash],
    }

    methods = method_map[ioc_type]
    results = await asyncio.gather(*[m(value) for m in methods], return_exceptions=False)

    score, classification = RiskScoreCalculator.calculate(list(results))

    response = {
        "ioc_type": ioc_type,
        "ioc_value": value,
        "risk_score": score,
        "classification": classification,
        "sources": list(results),
        "from_cache": False,
    }

    # 3. Guardar en cache
    await cache_set(cache_key, response)
    return response