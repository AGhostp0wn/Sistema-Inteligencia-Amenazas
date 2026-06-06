export type IocType = "ip" | "domain" | "url" | "hash";

export type Classification = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface SourceResult {
  source: string;
  supported: boolean;
  error?: string;
  abuse_score?: number;
  total_reports?: number;
  country?: string;
  isp?: string;
  is_tor?: boolean;
  pulse_count?: number;
  reputation?: number;
  asn?: string;
  query_status?: string;
  threat?: string;
  url_status?: string;
  tags?: string[];
  file_type?: string;
  signature?: string;
}

export interface ThreatResponse {
  ioc_type: IocType;
  ioc_value: string;
  risk_score: number;
  classification: Classification;
  from_cache: boolean;
  sources: SourceResult[];
}