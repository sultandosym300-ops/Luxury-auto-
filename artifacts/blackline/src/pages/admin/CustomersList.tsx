import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import type { Customer } from "@/lib/api";

function initials(c: Customer) {
  const f = c.firstName?.[0] ?? "";
  const l = c.lastName?.[0] ?? "";
  return (f + l).toUpperCase() || c.email?.[0]?.toUpperCase() ?? "?";
}

export default function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<Customer[]>("/admin/customers").then(setCustomers).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-1 h-8 bg-[#C9A86A] animate-pulse" />
    </div>
  );

  return (
    <div>
      <div className="mb-10">
        <p className="text-[#C9A86A] tracking-[0.3em] text-[10px] uppercase mb-2">Manage</p>
        <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight">Customers</h1>
      </div>

      {customers.length === 0 ? (
        <div className="border border-[#1A1A1A] bg-[#111111] p-14 text-center">
          <p className="text-[#8A8A8A] text-sm">No customers yet.</p>
          <p className="text-[#333] text-xs mt-2">Customers who sign in via Replit Auth will appear here.</p>
        </div>
      ) : (
        <div className="border border-[#1A1A1A] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Customer", "Email", "Joined"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className={`border-b border-[#1A1A1A] last:border-0 ${i % 2 === 0 ? "bg-[#070707]" : "bg-[#111111]"}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-[#1A1A1A] flex items-center justify-center text-[11px] text-[#C9A86A] font-serif flex-shrink-0">
                        {initials(c)}
                      </div>
                      <div>
                        <p className="text-sm text-[#F5F5F5]">
                          {c.firstName || c.lastName ? `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() : "—"}
                        </p>
                        <p className="text-[10px] text-[#8A8A8A] font-mono truncate max-w-[140px]">{c.id.slice(0, 12)}…</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#8A8A8A]">{c.email ?? "—"}</td>
                  <td className="px-5 py-4 text-sm text-[#8A8A8A]">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
