import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { get, post, patch, del } from "@/lib/api";
import type { Service } from "@/lib/api";

function ServiceForm({ initial, onSave, onCancel }: {
  initial?: Partial<Service>;
  onSave: (d: Partial<Service>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    basePrice: initial?.basePrice ?? "",
    duration: initial?.duration ?? "",
    isActive: initial?.isActive ?? true,
    displayOrder: initial?.displayOrder ?? 0,
  });

  return (
    <div className="border border-[#C9A86A]/30 bg-[#111111] p-6 mb-3">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Starting Price</label>
          <input value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })}
            placeholder="2500.00" className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Duration</label>
          <input value={form.duration ?? ""} onChange={e => setForm({ ...form, duration: e.target.value })}
            placeholder="3-5 days" className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Description</label>
          <textarea value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={2} className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50 resize-none" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onSave(form)} disabled={!form.name || !form.basePrice}
          className="flex items-center gap-1.5 bg-[#C9A86A] text-[#070707] px-5 py-2 text-[11px] font-medium tracking-wide uppercase hover:bg-[#b8974f] transition-colors disabled:opacity-30">
          <Check size={12} /> Save
        </button>
        <button onClick={onCancel} className="flex items-center gap-1.5 border border-[#1A1A1A] text-[#8A8A8A] px-5 py-2 text-[11px] uppercase hover:text-[#F5F5F5] transition-colors">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    get<Service[]>("/admin/services").then(setServices).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data: Partial<Service>) => {
    const s = await post<Service>("/admin/services", data);
    setServices(prev => [...prev, s]);
    setAdding(false);
  };

  const handleEdit = async (id: number, data: Partial<Service>) => {
    const s = await patch<Service>(`/admin/services/${id}`, data);
    setServices(prev => prev.map(p => p.id === id ? s : p));
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    setDeleting(id);
    await del(`/admin/services/${id}`);
    setServices(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    const s = await patch<Service>(`/admin/services/${id}`, { isActive });
    setServices(prev => prev.map(p => p.id === id ? s : p));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-1 h-8 bg-[#C9A86A] animate-pulse" />
    </div>
  );

  return (
    <div>
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="text-[#C9A86A] tracking-[0.3em] text-[10px] uppercase mb-2">Manage</p>
          <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight">Services</h1>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-[#C9A86A] text-[#070707] px-5 py-2.5 text-[11px] font-medium tracking-wide uppercase hover:bg-[#b8974f] transition-colors mt-4">
            <Plus size={13} /> Add Service
          </button>
        )}
      </div>

      {adding && <ServiceForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

      {services.length === 0 && !adding ? (
        <div className="border border-[#1A1A1A] bg-[#111111] p-14 text-center">
          <p className="text-[#8A8A8A] text-sm">No services yet.</p>
          <button onClick={() => setAdding(true)} className="mt-4 text-[#C9A86A] text-[11px] tracking-wide uppercase hover:text-white transition-colors">
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="border border-[#1A1A1A] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Service", "Price", "Duration", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <>
                  {editing === s.id ? (
                    <tr key={`${s.id}-edit`} className="border-b border-[#1A1A1A]">
                      <td colSpan={5} className="p-4">
                        <ServiceForm initial={s} onSave={d => handleEdit(s.id, d)} onCancel={() => setEditing(null)} />
                      </td>
                    </tr>
                  ) : (
                    <tr key={s.id} className={`border-b border-[#1A1A1A] last:border-0 ${i % 2 === 0 ? "bg-[#070707]" : "bg-[#111111]"}`}>
                      <td className="px-5 py-4">
                        <p className="text-sm text-[#F5F5F5] font-medium">{s.name}</p>
                        {s.description && <p className="text-[10px] text-[#8A8A8A] mt-0.5 max-w-[240px] truncate">{s.description}</p>}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#C9A86A]">${parseFloat(s.basePrice).toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-[#8A8A8A]">{s.duration ?? "—"}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleToggle(s.id, !s.isActive)}
                          className={`text-[10px] tracking-wider px-2.5 py-1 border transition-colors ${
                            s.isActive ? "border-[#C9A86A]/20 text-[#C9A86A]/80 hover:bg-[#C9A86A]/10" : "border-[#1A1A1A] text-[#333] hover:text-[#8A8A8A]"
                          }`}>
                          {s.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setEditing(s.id)} className="text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"><Pencil size={13} /></button>
                          <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                            className="text-red-500/40 hover:text-red-400 transition-colors disabled:opacity-30"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
