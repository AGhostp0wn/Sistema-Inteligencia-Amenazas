import api from "./axios";

// El prefix en FastAPI es /threat, Traefik stripea /api/threat
// entonces la ruta real es: /api/threat/threat/ip/{valor}
export const searchIp = (ip: string) =>
  api.get(`/api/threat/threat/ip/${ip}`);

export const searchDomain = (domain: string) =>
  api.get(`/api/threat/threat/domain/${domain}`);

export const searchUrl = (url: string) =>
  api.get(`/api/threat/threat/url/${encodeURIComponent(url)}`);

export const searchHash = (hash: string) =>
  api.get(`/api/threat/threat/hash/${hash}`);