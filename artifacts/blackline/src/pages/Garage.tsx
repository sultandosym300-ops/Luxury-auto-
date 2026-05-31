import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Car, ArrowLeft, Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { get, post, patch, del } from "@/lib/api";
import type { Vehicle } from "@/lib/api";

const CX = "max-w-[720px] mx-auto px-6";

// ── Add / Edit form ──────────────────────────────────────────────────────────

function VehicleForm({ initial, onSave, onCancel }: {
  initial?: Partial<Vehicle>;
  onSave: (data: Partial<Vehicle>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    make: initial?.make ?? "", model: initial?.model ?? "",
    year: initial?.year?.toString() ?? "", color: initial?.color ?? "",
    vin: initial?.vin ?? "", notes: initial?.notes ?? "",
  });

  const valid = form.make && form.model && form.year;

  return (
    <div className="bg-[#111111] border border-[#1A1A1A] p-8">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {([ ["make","Make","Porsche"], ["model","Model","911 GT3"], ["year","Year","2024"], ["color","Color","Guards Red"] ] as const).map(([key, label, placeholder]) => (
          <div key={key}>
            <label className="block text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-2">{label}</label>
            <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-3 text-sm placeholder:text-[#333] focus:outline-none focus:border-[#C9A86A]/50 transition-colors" />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-2">VIN (Optional)</label>
        <input value={form.vin} onChange={e => setForm({ ...form, vin: e.target.value })}
          placeholder="WP0AB2A97PS223456"
          className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-3 text-sm placeholder:text-[#333] focus:outline-none focus:border-[#C9A86A]/50 transition-colors font-mono" />
      </div>
      <div className="mb-6">
        <label className="block text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-2">Notes (Optional)</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          rows={2} placeholder="Any notes about this vehicle…"
          className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-3 text-sm placeholder:text-[#333] focus:outline-none focus:border-[#C9A86A]/50 transition-colors resize-none" />
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave({ ...form, year: parseInt(form.year) })}
          disabled={!valid}
          className="bg-[#C9A86A] text-[#070707] px-8 py-3 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-[#b8974f] transition-colors disabled:opacity-30">
          Save Vehicle
        </button>
        <button onClick={onCancel}
          className="px-6 py-3 text-[11px] tracking-[0.15em] text-[#8A8A8A] border border-[#1A1A1A] hover:text-[#F5F5F5] uppercase transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Vehicle Detail ────────────────────────────────────────────────────────────

function VehicleDetail({ id }: { id: number }) {
  const [data, setData] = useState<{ vehicle: Vehicle; history: any[] } | null>(null);
  const [editing, setEditing] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    get<{ vehicle: Vehicle; history: any[] }>(`/portal/vehicles/${id}`).then(setData).catch(() => setLocation("/portal/garage"));
  }, [id]);

  const handleUpdate = async (updates: Partial<Vehicle>) => {
    const updated = await patch<Vehicle>(`/portal/vehicles/${id}`, updates);
    setData(d => d ? { ...d, vehicle: updated } : null);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Remove this vehicle from your garage?")) return;
    await del(`/portal/vehicles/${id}`);
    setLocation("/portal/garage");
  };

  if (!data) return <div className="flex items-center justify-center h-48"><div className="w-1 h-6 bg-[#C9A86A] animate-pulse" /></div>;

  const { vehicle, history } = data;

  return (
    <div>
      <Link href="/portal/garage" className="flex items-center gap-2 text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors text-[11px] tracking-wide uppercase mb-8">
        <ArrowLeft size={12} /> Back to Garage
      </Link>

      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-2">Vehicle Record</p>
          <h2 className="font-serif text-3xl text-[#F5F5F5]">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
          {vehicle.color && <p className="text-[#8A8A8A] text-sm mt-1">{vehicle.color}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setEditing(e => !e)}
            className="flex items-center gap-2 text-[#8A8A8A] hover:text-[#F5F5F5] border border-[#1A1A1A] px-4 py-2 text-[11px] tracking-wide uppercase transition-colors">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={handleDelete}
            className="flex items-center gap-2 text-red-500/60 hover:text-red-400 border border-[#1A1A1A] px-4 py-2 text-[11px] tracking-wide uppercase transition-colors">
            <Trash2 size={12} /> Remove
          </button>
        </div>
      </div>

      {editing && <div className="mb-8"><VehicleForm initial={vehicle} onSave={handleUpdate} onCancel={() => setEditing(false)} /></div>}

      {vehicle.vin && (
        <div className="bg-[#111111] border border-[#1A1A1A] p-5 mb-6">
          <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-1.5">VIN</p>
          <p className="text-[#F5F5F5] text-sm font-mono tracking-wider">{vehicle.vin}</p>
        </div>
      )}

      <h3 className="font-serif text-lg text-[#F5F5F5] mb-4">Service History</h3>
      {history.length === 0 ? (
        <div className="bg-[#111111] border border-[#1A1A1A] p-10 text-center">
          <p className="text-[#8A8A8A] text-sm">No service records for this vehicle yet.</p>
          <Link href="/booking" className="inline-block mt-4 text-[#C9A86A] text-[11px] tracking-wide uppercase hover:text-white transition-colors">
            Schedule a Service
          </Link>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1A1A1A] divide-y divide-[#1A1A1A]">
          {history.map((h: any) => (
            <div key={h.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#F5F5F5] text-sm font-medium mb-0.5">{h.serviceName}</p>
                  {h.technicianName && <p className="text-[#8A8A8A] text-xs">{h.technicianName}</p>}
                </div>
                {h.completedAt && (
                  <p className="text-[#8A8A8A] text-xs">{new Date(h.completedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                )}
              </div>
              {h.notes && <p className="text-[#8A8A8A] text-xs mt-2">{h.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Garage list ───────────────────────────────────────────────────────────────

function GarageList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<Vehicle[]>("/portal/vehicles").then(setVehicles).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data: Partial<Vehicle>) => {
    const v = await post<Vehicle>("/portal/vehicles", data);
    setVehicles(vs => [v, ...vs]);
    setAdding(false);
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-1 h-6 bg-[#C9A86A] animate-pulse" /></div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-10">
        <div>
          <Link href="/portal" className="flex items-center gap-2 text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors text-[11px] tracking-wide uppercase mb-4">
            <ArrowLeft size={12} /> Portal
          </Link>
          <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-2">Vehicle Management</p>
          <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight leading-none">My Garage</h1>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-[#C9A86A] text-[#070707] px-6 py-3 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-[#b8974f] transition-colors mt-10">
            <Plus size={13} /> Add Vehicle
          </button>
        )}
      </div>

      {adding && <div className="mb-6"><VehicleForm onSave={handleAdd} onCancel={() => setAdding(false)} /></div>}

      {vehicles.length === 0 && !adding ? (
        <div className="bg-[#111111] border border-[#1A1A1A] p-14 text-center">
          <Car size={28} className="text-[#333] mx-auto mb-4" />
          <p className="text-[#8A8A8A] text-sm mb-2">Your garage is empty.</p>
          <p className="text-[#333] text-xs mb-6">Add a vehicle to track its service history.</p>
          <button onClick={() => setAdding(true)} className="text-[#C9A86A] text-[11px] tracking-wide uppercase hover:text-white transition-colors">
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {vehicles.map(v => (
            <Link key={v.id} href={`/portal/garage/${v.id}`}
              className="flex items-center justify-between bg-[#111111] border border-[#1A1A1A] px-6 py-5 hover:border-[#C9A86A]/30 transition-colors group">
              <div className="flex items-center gap-4">
                <Car size={16} className="text-[#C9A86A] flex-shrink-0" />
                <div>
                  <p className="text-[#F5F5F5] text-sm font-medium">{v.year} {v.make} {v.model}</p>
                  {v.color && <p className="text-[#8A8A8A] text-xs mt-0.5">{v.color}{v.vin ? ` · ${v.vin.slice(0, 8)}…` : ""}</p>}
                </div>
              </div>
              <ChevronRight size={14} className="text-[#333] group-hover:text-[#C9A86A] transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Garage() {
  const { isLoading, isAuthenticated, login } = useAuth();
  const [, detailParams] = useRoute("/portal/garage/:id");
  const vehicleId = detailParams?.id ? parseInt(detailParams.id) : null;

  if (isLoading) return <div className="min-h-screen bg-[#070707] flex items-center justify-center"><div className="w-1 h-6 bg-[#C9A86A] animate-pulse" /></div>;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[#8A8A8A] text-sm mb-6">Sign in to access your garage.</p>
        <button onClick={login} className="bg-[#C9A86A] text-[#070707] px-8 py-3 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors">Sign In</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] pt-28 pb-40">
      <div className={CX}>
        {vehicleId ? <VehicleDetail id={vehicleId} /> : <GarageList />}
      </div>
    </div>
  );
}
