import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { get, put } from "@/lib/api";

const SETTING_FIELDS = [
  { key: "studio_name", label: "Studio Name", placeholder: "BLACKLINE AUTO STUDIO" },
  { key: "studio_phone", label: "Phone Number", placeholder: "+1 (555) 000-0000" },
  { key: "studio_email", label: "Contact Email", placeholder: "studio@blacklineauto.com" },
  { key: "studio_address", label: "Address", placeholder: "123 Auto Row, Beverly Hills, CA" },
  { key: "booking_open", label: "Bookings Open?", placeholder: "true or false" },
  { key: "admin_code", label: "Admin Access Code", placeholder: "Change the admin PIN code" },
];

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    get<Record<string, string>>("/admin/settings").then(s => {
      setSettings(s);
      setForm(s);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await put("/admin/settings", form);
      setSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(settings);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-1 h-8 bg-[#C9A86A] animate-pulse" /></div>;

  return (
    <div>
      <div className="mb-10">
        <p className="text-[#C9A86A] tracking-[0.3em] text-[10px] uppercase mb-2">Configuration</p>
        <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight">Settings</h1>
      </div>

      <div className="border border-[#1A1A1A] bg-[#111111] p-8 max-w-xl">
        <div className="space-y-6">
          {SETTING_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-2">{label}</label>
              <input
                value={form[key] ?? ""}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                type={key === "admin_code" ? "password" : "text"}
                className="w-full bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-3 text-sm placeholder:text-[#333] focus:outline-none focus:border-[#C9A86A]/50 transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 bg-[#C9A86A] text-[#070707] px-8 py-3 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-[#b8974f] transition-colors disabled:opacity-30"
          >
            {saving ? "Saving…" : saved ? <><Check size={13} /> Saved</> : "Save Settings"}
          </button>
          {isDirty && !saving && (
            <button onClick={() => setForm(settings)} className="text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors text-[11px] uppercase tracking-wide">
              Discard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
