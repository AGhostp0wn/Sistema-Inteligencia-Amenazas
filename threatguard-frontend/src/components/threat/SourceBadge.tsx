import type { SourceResult } from "../../types/threat";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";

interface Props {
  source: SourceResult;
}

export default function SourceBadge({ source }: Props) {
  const isError = !!source.error;
  const isUnsupported = !source.supported;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      {/* Header fuente */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isError || isUnsupported ? (
            isUnsupported ? (
              <MinusCircle className="w-4 h-4 text-gray-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )
          ) : (
            <CheckCircle className="w-4 h-4 text-green-400" />
          )}
          <span className="text-white text-sm font-semibold uppercase tracking-wider">
            {source.source}
          </span>
        </div>
        {isUnsupported && (
          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">
            No aplica
          </span>
        )}
        {isError && (
          <span className="text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded">
            Error
          </span>
        )}
      </div>

      {/* Datos */}
      {!isUnsupported && !isError && (
        <div className="space-y-1.5">
          {source.abuse_score !== undefined && (
            <Row label="Abuse Score" value={`${source.abuse_score}/100`} />
          )}
          {source.total_reports !== undefined && (
            <Row label="Reportes" value={String(source.total_reports)} />
          )}
          {source.country && (
            <Row label="País" value={source.country} />
          )}
          {source.isp && <Row label="ISP" value={source.isp} />}
          {source.is_tor !== undefined && (
            <Row label="TOR" value={source.is_tor ? "Sí" : "No"} />
          )}
          {source.pulse_count !== undefined && (
            <Row label="Pulses OTX" value={String(source.pulse_count)} />
          )}
          {source.asn && <Row label="ASN" value={source.asn} />}
          {source.query_status && (
            <Row label="Estado" value={source.query_status} />
          )}
          {source.threat && <Row label="Amenaza" value={source.threat} />}
          {source.signature && (
            <Row label="Firma" value={source.signature} />
          )}
          {source.tags && source.tags.length > 0 && (
            <Row label="Tags" value={source.tags.join(", ")} />
          )}
        </div>
      )}

      {isError && (
        <p className="text-red-400 text-xs font-mono">{source.error}</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-300 font-mono">{value}</span>
    </div>
  );
}