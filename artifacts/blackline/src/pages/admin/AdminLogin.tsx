import { useState } from "react";
import { useLocation } from "wouter";
import { post } from "@/lib/api";

export default function AdminLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      await post("/admin/auth/login", { code });
      setLocation("/admin");
    } catch {
      setError(true);
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <p className="font-serif text-2xl tracking-[0.25em] text-[#C9A86A] uppercase mb-2">BLACKLINE</p>
          <p className="text-[#8A8A8A] text-[10px] tracking-[0.2em] uppercase">Studio Management</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-2">Access Code</label>
            <input
              type="password"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false); }}
              className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-3.5 text-sm placeholder:text-[#333] focus:outline-none focus:border-[#C9A86A]/50 transition-colors"
              placeholder="Enter access code"
              autoComplete="current-password"
              autoFocus
            />
            {error && <p className="text-red-500/70 text-xs mt-2">Incorrect access code.</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !code}
            className="w-full bg-[#C9A86A] text-[#070707] py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating…" : "Enter Studio"}
          </button>
        </form>
      </div>
    </div>
  );
}
