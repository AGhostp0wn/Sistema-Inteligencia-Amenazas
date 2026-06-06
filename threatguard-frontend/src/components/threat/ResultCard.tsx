import type { ThreatResponse, Classification } from "../../types/threat";
import SourceBadge from "./SourceBadge";
import { createPdf, createJson } from "../../api/report.api";
import toast from "react-hot-toast";
import { Download, FileJson, Database } from "lucide-react";

interface Props {
  result: ThreatResponse;
}

const CLASSIFICATION_STYLES: Record<Classification, { bg: string; text: string; border: string; bar: string }> = {
  LOW:      { bg: "bg-green-900/20",  text: "text-green-400",  border: "border-green-800",  bar: "bg-green-500"  },
  MEDIUM:   { bg: "bg-yellow-900/20", text: "text-yellow-400", border: "border-yellow-800", bar: "bg-yellow-500" },
  HIGH:     { bg: "bg-orange-900/20", text: "text-orange-400", border: "border-orange-800", bar: "bg-orange-500" },
  CRITICAL: { bg: "bg-red-900/20",    text: "text-red-400",    border: "border-red-800",    bar: "bg-red-500"    },
};

export default function ResultCard({ result }: Props) {
  const style = CLASSIFICATION_STYLES[result.classification];

  const downloadPdf = async () => {
    try {
      const res = await createPdf({
        analyst_name: "Analyst",
        notes: "",
        threat_data: result,
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `threatguard-${result.ioc_value}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF descargado");
    } catch {
      toast.error("Error generando PDF");
    }
  };

  const downloadJson = async () => {
    try {
      const res = await createJson({
        analyst_name: "Analyst",
        notes: "",
        threat_data: result,
      });
      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `threatguard-${result.ioc_value}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("JSON descargado");
    } catch {
      toast.error("Error generando JSON");
    }
  };

  return (
    <div className={`border rounded-xl p-5 ${style.bg} ${style.border}`}>
      {/* Header resultado */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-500 uppercase">
              {result.ioc_type}
            </span>
            {result.from_cache && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                <Database className="w-3 h-3" />
                cache
              </span>
            )}
          </div>
          <p className="text-white font-mono text-sm break-all">
            {result.ioc_value}
          </p>
        </div>

        {/* Risk Score */}
        <div className="text-right ml-4 shrink-0">
          <div className={`text-3xl font-bold ${style.text}`}>
            {result.risk_score}
          </div>
          <div className={`text-xs font-semibold ${style.text}`}>
            {result.classification}
          </div>
        </div>
      </div>

      {/* Barra de score */}
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-5">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${style.bar}`}
          style={{ width: `${result.risk_score}%` }}
        />
      </div>

      {/* Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {result.sources.map((s, i) => (
          <SourceBadge key={i} source={s} />
        ))}
      </div>

      {/* Acciones de reporte */}
      <div className="flex gap-2 pt-3 border-t border-gray-700">
        <button
          onClick={downloadPdf}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Descargar PDF
        </button>
        <button
          onClick={downloadJson}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-1.5 transition-colors"
        >
          <FileJson className="w-3.5 h-3.5" />
          Descargar JSON
        </button>
      </div>
    </div>
  );
}