import { useState } from "react";
import Layout from "../components/layout/Layout";
import SearchBar from "../components/threat/SearchBar";
import ResultCard from "../components/threat/ResultCard";
import { searchIp, searchDomain, searchUrl, searchHash } from "../api/threat.api";
import type { IocType, ThreatResponse } from "../types/threat";
import toast, { Toaster } from "react-hot-toast";
import { ShieldAlert, Activity, Crosshair } from "lucide-react";

const SEARCHERS: Record<IocType, (v: string) => Promise<any>> = {
  ip: searchIp,
  domain: searchDomain,
  url: searchUrl,
  hash: searchHash,
};

export default function DashboardPage() {
  const [result, setResult] = useState<ThreatResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (type: IocType, value: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await SEARCHERS[type](value);
      setResult(res.data);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Sesión expirada. Inicia sesión de nuevo.");
      } else {
        toast.error("Error al consultar el IOC.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold mb-1 flex items-center gap-2">
          <Crosshair className="w-6 h-6 text-cyan-400" />
          IOC Analysis
        </h1>
        <p className="text-gray-500 text-sm">
          Ingresa una IP, dominio, URL o hash SHA256 para analizar
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="w-10 h-10 border-2 border-gray-700 border-t-cyan-500 rounded-full animate-spin mb-4" />
          <p className="text-sm">Consultando fuentes de inteligencia...</p>
          <p className="text-xs text-gray-600 mt-1">
            AbuseIPDB · AlienVault OTX · URLHaus
          </p>
        </div>
      )}

      {/* Resultado */}
      {result && !loading && <ResultCard result={result} />}

      {/* Estado vacío */}
      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <ShieldAlert className="w-12 h-12 mb-4 text-gray-700" />
          <p className="text-sm font-medium text-gray-500">
            Ningún IOC analizado
          </p>
          <p className="text-xs mt-1">
            Ingresa un indicador de compromiso para comenzar
          </p>

          {/* Stats decorativas */}
          <div className="flex gap-6 mt-10 text-center">
            {[
              { label: "Fuentes", value: "3", icon: Activity },
              { label: "Tipos IOC", value: "4", icon: Crosshair },
              { label: "Score máx", value: "100", icon: ShieldAlert },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5 text-gray-700" />
                <span className="text-xl font-bold text-gray-600">{value}</span>
                <span className="text-xs text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}