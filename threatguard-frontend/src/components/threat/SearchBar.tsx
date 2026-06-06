import { useState } from "react";
import { Search } from "lucide-react";
import type { IocType } from "../../types/threat";

interface Props {
  onSearch: (type: IocType, value: string) => void;
  loading: boolean;
}

const IOC_TYPES: { value: IocType; label: string; placeholder: string }[] = [
  { value: "ip", label: "IP", placeholder: "1.2.3.4" },
  { value: "domain", label: "Dominio", placeholder: "malicious-site.com" },
  { value: "url", label: "URL", placeholder: "http://malicious-site.com/payload" },
  { value: "hash", label: "Hash SHA256", placeholder: "a3f5b2c1d4e6..." },
];

export default function SearchBar({ onSearch, loading }: Props) {
  const [type, setType] = useState<IocType>("ip");
  const [value, setValue] = useState("");

  const selected = IOC_TYPES.find((t) => t.value === type)!;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(type, value.trim());
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex gap-2">
        {/* Tipo de IOC */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value as IocType)}
          className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
        >
          {IOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Input */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={selected.placeholder}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
        />

        {/* Botón */}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-semibold rounded-lg px-5 py-2.5 text-sm flex items-center gap-2 transition-colors"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {loading ? "Analizando..." : "Analizar"}
        </button>
      </div>
    </form>
  );
}