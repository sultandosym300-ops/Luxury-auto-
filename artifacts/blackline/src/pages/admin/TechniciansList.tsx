import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { get, post, patch, del } from "@/lib/api";
import type { Technician } from "@/lib/api";

function TechForm({ initial, onSave, onCancel }: {
  initial?: Partial<Technician>;
  onSave: (d: Partial<Technician>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    specialty: initial?.specialty ?? "",
    bio: initial?.bio ?? "",
    yearsExperience: initial?.yearsExperience ?? 1,
    initials: initial?.initials ?? "",
    isActive: initial?.isActive ?? true,
  });

  return (
    <div className="border border-[#C9A86A]/30 bg-[#0a0a0a] p-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Specialty</label>
          <input value={form.specialty ?? ""} onChange={e => setForm({ ...form, specialty: e.target.value })}
            placeholder="PPF & Ceramic Specialist"
            className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Years Experience</label>
          <input type="number" value={form.yearsExperience} onChange={e => setForm({ ...form, yearsExperience: parseInt(e.target.value) || 1 })}
            min="1" className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Initials (2 chars)</label>
          <input value={form.initials ?? ""} maxLength={2} onChange={e => setForm({ ...form, initials: e.target.value.toUpperCase() })}
            placeholder="MR" className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50 font-mono" />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-1.5">Bio</label>
          <textarea value={form.bio ?? ""} onChange={e => setForm({ ...form, bio: e.target.value })}
            rows={2} className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50 resize-none" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} disabled={!form.name}
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

export default function TechniciansList() {
  const [techs, setTechs] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    get<Technician[]>("/admin/technicians").then(setTechs).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data: Partial<Technician>) => {
    const t = await post<Technician>("/admin/technicians", data);
    setTechs(prev => [...prev, t]);
    setAdding(false);
  };

  const handleEdit = async (id: number, data: Partial<Technician>) => {
    const t = await patch<Technician>(`/admin/technicians/${id}`, data);
    setTechs(prev => prev.map(p => p.id === id ? t : p));
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this technician?")) return;
    await del(`/admin/technicians/${id}`);
    setTechs(prev => prev.filter(t => t.id !== id));
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
          <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight">Technicians</h1>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-[#C9A86A] text-[#070707] px-5 py-2.5 text-[11px] font-medium tracking-wide uppercase hover:bg-[#b8974f] transition-colors mt-4">
            <Plus size={13} /> Add Technician
          </button>
        )}
      </div>

      {adding && <div className="mb-4"><TechForm onSave={handleAdd} onCancel={() => setAdding(false)} /></div>}

      {techs.length === 0 && !adding ? (
        <div className="border border-[#1A1A1A] bg-[#111111] p-14 text-center">
          <p className="text-[#8A8A8A] text-sm">No technicians yet.</p>
          <button onClick={() => setAdding(true)} className="mt-4 text-[#C9A86A] text-[11px] tracking-wide uppercase hover:text-white transition-colors">
            Add Your First Technician
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techs.map(tech => (
            editing === tech.id ? (
              <div key={tech.id} className="md:col-span-2">
                <TechForm initial={tech} onSave={d => handleEdit(tech.id, d)} onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <div key={tech.id} className="border border-[#1A1A1A] bg-[#111111] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-[#1A1A1A] flex items-center justify-center font-serif text-xs text-[#C9A86A] flex-shrink-0">
                      {tech.initials ?? tech.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-[#F5F5F5] mb-0.5">{tech.name}</h3>
                      <p className="text-[#C9A86A]/60 text-[10px] tracking-wide">{tech.specialty ?? "—"}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] tracking-wide px-2 py-1 border ${tech.isActive ? "border-[#C9A86A]/20 text-[#C9A86A]/70" : "border-[#1A1A1A] text-[#333]"}`}>
                    {tech.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {tech.bio && <p className="text-[#8A8A8A] text-xs leading-relaxed mb-4">{tech.bio}</p>}

                <div className="border-t border-[#1A1A1A] pt-4 flex items-center justify-between">
                  <span className="text-[#8A8A8A] text-xs">{tech.yearsExperience} yrs experience</span>
                  <div className="flex gap-3">
                    <button onClick={() => setEditing(tech.id)} className="text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(tech.id)} className="text-red-500/40 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
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
