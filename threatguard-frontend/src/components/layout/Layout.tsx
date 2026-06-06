import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { Shield, LogOut, Activity } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Topbar */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center">
            <Shield className="w-4 h-4 text-gray-950" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            ThreatGuard<span className="text-cyan-400"> AI</span>
          </span>
          <span className="ml-3 text-gray-600 text-xs font-mono border border-gray-800 rounded px-2 py-0.5">
            SOC DASHBOARD
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-green-400 text-xs">
            <Activity className="w-3.5 h-3.5" />
            <span>Sistemas operativos</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}