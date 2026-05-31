import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { get, post, patch, del } from "@/lib/api";
import type { PortfolioProject } from "@/lib/api";

function PortfolioForm({ initial, onSave, onCancel }: {
  initial?: Partial<PortfolioProject>;
  onSave: (d: Partial<PortfolioProject>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    vehicleName: initial?.vehicleName ?? "",
    vehicleYear: initial?.vehicleYear?.toString() ?? "",
    imageUrl: initial?.imageUrl ?? "",
    services: (initial?.services ?? []).join(", "),
    completionDate: initial?.completionDate ?? "",
    isPublished: initial?.isPublished ?? true,
    displayOrder: initial?.displayOrder ?? 0,
  });

  return (
    <div className="border border-[#C9A86A]/30 bg-[#0a0a0a] p-6 mb-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Vehicle Name</label>
          <input value={form.vehicleName} onChange={e => setForm({ ...form, vehicleName: e.target.value })}
            placeholder="2024 Porsche 911 GT3 RS"
            className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Year</label>
          <input type="number" value={form.vehicleYear} onChange={e => setForm({ ...form, vehicleYear: e.target.value })}
            placeholder="2024" className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Image URL</label>
          <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://…"
            className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Services (comma-separated)</label>
          <input value={form.services} onChange={e => setForm({ ...form, services: e.target.value })}
            placeholder="PPF, Ceramic Coating"
            className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Completion Date</label>
          <input type="date" value={form.completionDate ?? ""} onChange={e => setForm({ ...form, completionDate: e.target.value })}
            className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave({ ...form, vehicleYear: form.vehicleYear ? parseInt(form.vehicleYear) : undefined, services: form.services.split(",").map(s => s.trim()).filter(Boolean) })}
          disabled={!form.vehicleName}
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

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    get<PortfolioProject[]>("/admin/portfolio").then(setProjects).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data: Partial<PortfolioProject>) => {
    const p = await post<PortfolioProject>("/admin/portfolio", data);
    setProjects(prev => [...prev, p]);
    setAdding(false);
  };

  const handleEdit = async (id: number, data: Partial<PortfolioProject>) => {
    const p = await patch<PortfolioProject>(`/admin/portfolio/${id}`, data);
    setProjects(prev => prev.map(x => x.id === id ? p : x));
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this portfolio entry?")) return;
    await del(`/admin/portfolio/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleToggle = async (id: number, isPublished: boolean) => {
    const p = await patch<PortfolioProject>(`/admin/portfolio/${id}`, { isPublished });
    setProjects(prev => prev.map(x => x.id === id ? p : x));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-1 h-8 bg-[#C9A86A] animate-pulse" /></div>;

  return (
    <div>
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="text-[#C9A86A] tracking-[0.3em] text-[10px] uppercase mb-2">Content</p>
          <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight">Portfolio</h1>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-[#C9A86A] text-[#070707] px-5 py-2.5 text-[11px] font-medium tracking-wide uppercase hover:bg-[#b8974f] transition-colors mt-4">
            <Plus size={13} /> Add Entry
          </button>
        )}
      </div>

      {adding && <PortfolioForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

      {projects.length === 0 && !adding ? (
        <div className="border border-[#1A1A1A] bg-[#111111] p-14 text-center">
          <p className="text-[#8A8A8A] text-sm">No portfolio entries yet.</p>
          <button onClick={() => setAdding(true)} className="mt-4 text-[#C9A86A] text-[11px] tracking-wide uppercase hover:text-white transition-colors">
            Add Your First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            editing === p.id ? (
              <div key={p.id} className="md:col-span-2">
                <PortfolioForm initial={p} onSave={d => handleEdit(p.id, d)} onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <div key={p.id} className="border border-[#1A1A1A] overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.vehicleName} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-[#111111] flex items-center justify-center">
                    <span className="text-[#333] text-xs">No Image</span>
                  </div>
                )}
                <div className="p-5 bg-[#111111]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[#F5F5F5] text-sm font-medium">{p.vehicleName}</p>
                      {(p.services ?? []).length > 0 && (
                        <p className="text-[#8A8A8A] text-xs mt-0.5">{p.services!.join(", ")}</p>
                      )}
                    </div>
                    <button onClick={() => handleToggle(p.id, !p.isPublished)}
                      className={`text-[10px] tracking-wide px-2 py-1 border transition-colors flex-shrink-0 ${p.isPublished ? "border-[#C9A86A]/20 text-[#C9A86A]/80" : "border-[#1A1A1A] text-[#333]"}`}>
                      {p.isPublished ? "Published" : "Draft"}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditing(p.id)} className="text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500/40 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
