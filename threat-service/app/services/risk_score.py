class RiskScoreCalculator:
    """
    Risk Score 0–100. Escala final:
      0–25  → LOW
      26–50 → MEDIUM
      51–75 → HIGH
      76–100 → CRITICAL
    """

    @staticmethod
    def calculate(results: list[dict]) -> tuple[int, str]:
        score = 0

        for r in results:
            if r.get("error") or not r.get("supported", True):
                continue

            source = r.get("source")

            if source == "abuseipdb":
                # AbuseIPDB da 0-100 directo, lo escalamos a 40 pts
                abuse = r.get("abuse_score", 0)
                score += int((abuse / 100) * 40)

            elif source == "otx":
                # Pulses: 0 → 0pts, 1–3 → 15pts, 4–10 → 25pts, >10 → 35pts
                pulses = r.get("pulse_count", 0)
                if pulses == 0:
                    score += 0
                elif pulses <= 3:
                    score += 15
                elif pulses <= 10:
                    score += 25
                else:
                    score += 35

            elif source == "urlhaus":
                status = r.get("query_status", "")
                if status in ("is_malware", "malicious"):
                    score += 25
                elif status == "suspicious":
                    score += 12

        score = min(score, 100)
        classification = RiskScoreCalculator._classify(score)
        return score, classification

    @staticmethod
    def _classify(score: int) -> str:
        if score <= 25:
            return "LOW"
        elif score <= 50:
            return "MEDIUM"
        elif score <= 75:
            return "HIGH"
        return "CRITICAL"