import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import toast, { Toaster } from "react-hot-toast";
import { Shield, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      setToken(res.data.token);
      toast.success("Acceso concedido");
      navigate("/dashboard");
    } catch {
      toast.error("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-gray-950" />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            ThreatGuard<span className="text-cyan-400"> AI</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h1 className="text-white text-xl font-semibold mb-1">
            Iniciar sesión
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Plataforma de Threat Intelligence. CAMBIO PARA PRUEBA DEL CD AWS, IGNORAR ESTE CAMBIO
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@corp.com"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-semibold rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}