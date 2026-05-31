import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Shield,
  Droplets,
  Wrench,
  Sun,
  Sparkles,
  Armchair,
  Loader2,
} from "lucide-react";

// ─── data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "ppf", label: "Paint Protection Film", icon: Shield, desc: "Full-body armor against road hazards" },
  { id: "ceramic", label: "Ceramic Coating", icon: Droplets, desc: "Permanent hydrophobic protection" },
  { id: "tint", label: "Window Tint", icon: Sun, desc: "Premium automotive film installation" },
  { id: "paint", label: "Paint Correction", icon: Wrench, desc: "Multi-stage swirl removal & restoration" },
  { id: "detail", label: "Full Detail", icon: Sparkles, desc: "Complete interior & exterior restoration" },
  { id: "interior", label: "Interior Restoration", icon: Armchair, desc: "Leather, panels & deep cleaning" },
];

const TECHNICIANS = [
  { id: "marcus", name: "Marcus Rivera", specialty: "PPF & Ceramic Specialist", years: 9, initials: "MR", bio: "XPEL & 3M certified. Specializes in full-body film systems for exotic vehicles." },
  { id: "jordan", name: "Jordan Hayes", specialty: "Paint Correction Expert", years: 7, initials: "JH", bio: "DA and rotary specialist. Has restored paint on 300+ high-end vehicles." },
  { id: "alex", name: "Alex Chen", specialty: "Full Detail & Interior", years: 5, initials: "AC", bio: "Master-level interior restoration — leather, steam, odor elimination." },
  { id: "sarah", name: "Sarah Kim", specialty: "Window Film Specialist", years: 6, initials: "SK", bio: "3M certified installer. Precision film cuts, zero bubbles, lifetime warranty." },
];

const TIME_SLOTS = [
  { id: "0800", label: "8:00 AM", period: "Morning" },
  { id: "1000", label: "10:00 AM", period: "Morning" },
  { id: "1200", label: "12:00 PM", period: "Midday" },
  { id: "1400", label: "2:00 PM", period: "Afternoon" },
  { id: "1600", label: "4:00 PM", period: "Late Afternoon" },
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const STEP_LABELS = ["Service","Technician","Date","Time","Details","Confirm"];

// ─── helpers ─────────────────────────────────────────────────────────────────

function genRef() {
  return "BL-" + Math.random().toString(36).toUpperCase().slice(2, 8);
}

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

// ─── calendar ────────────────────────────────────────────────────────────────

function Calendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());

  const cells: (number | null)[] = [
    ...Array(firstDay(vy, vm)).fill(null),
    ...Array.from({ length: daysInMonth(vy, vm) }, (_, i) => i + 1),
  ];

  const isDisabled = (d: number) => {
    const dt = new Date(vy, vm, d);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return dt < today || dt.getDay() === 0;
  };
  const isSelected = (d: number) =>
    !!selected && selected.getFullYear() === vy && selected.getMonth() === vm && selected.getDate() === d;

  const prevMonth = () => vm === 0 ? (setVm(11), setVy(y => y - 1)) : setVm(m => m - 1);
  const nextMonth = () => vm === 11 ? (setVm(0), setVy(y => y + 1)) : setVm(m => m + 1);

  return (
    <div className="bg-[#111111] border border-[#1A1A1A] p-6">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors">
          <ChevronLeft size={15} />
        </button>
        <span className="font-serif text-[#F5F5F5] text-base">{MONTHS[vm]} {vy}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors">
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-[#8A8A8A] tracking-widest py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`e-${i}`} />
          ) : (
            <button
              key={day}
              disabled={isDisabled(day)}
              onClick={() => onSelect(new Date(vy, vm, day))}
              data-testid={`cal-day-${day}`}
              className={[
                "h-9 text-[13px] transition-colors duration-150",
                isSelected(day) ? "bg-[#C9A86A] text-[#070707] font-medium" : "",
                !isSelected(day) && !isDisabled(day) ? "text-[#F5F5F5] hover:bg-[#1A1A1A]" : "",
                isDisabled(day) ? "text-[#333] cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {day}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ─── animation ───────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

// ─── page ────────────────────────────────────────────────────────────────────

export default function Booking() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [tech, setTech] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", vehicle: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef] = useState(genRef);

  const selService = SERVICES.find(s => s.id === service);
  const selTech = TECHNICIANS.find(t => t.id === tech);
  const selSlot = TIME_SLOTS.find(t => t.id === time);

  const canNext =
    (step === 0 && !!service) ||
    (step === 1 && !!tech) ||
    (step === 2 && !!date) ||
    (step === 3 && !!time) ||
    (step === 4 && !!form.name && !!form.email && !!form.phone && !!form.vehicle) ||
    step === 5;

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setConfirmed(true);
  };

  // ── confirmation screen ───────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-14 h-14 border border-[#C9A86A] flex items-center justify-center mx-auto mb-8"
          >
            <Check size={20} className="text-[#C9A86A]" />
          </motion.div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#F5F5F5] mb-4 tracking-tight">
            Booking Confirmed
          </h2>
          <p className="text-[#8A8A8A] text-sm leading-relaxed mb-3">
            Your request has been received. {selTech?.name} will contact you within 24 hours to finalize your appointment.
          </p>
          <p className="text-[#C9A86A] text-xs tracking-[0.2em] uppercase mb-10">
            Reference: {bookingRef}
          </p>

          <div className="bg-[#111111] border border-[#1A1A1A] p-8 text-left mb-10">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Service", value: selService?.label },
                { label: "Technician", value: selTech?.name },
                { label: "Date", value: date ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
                { label: "Time", value: selSlot?.label },
                { label: "Vehicle", value: form.vehicle },
                { label: "Contact", value: form.email },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-1.5">{item.label}</p>
                  <p className="text-[#F5F5F5] text-sm">{item.value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          <a href="/" className="text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors text-[11px] tracking-[0.2em] uppercase">
            Return to Home
          </a>
        </motion.div>
      </div>
    );
  }

  // ── booking flow ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] pt-28 pb-40 px-6">
      <div className="max-w-[680px] mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-4">Reserve Your Appointment</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F5F5F5] tracking-tight leading-none">
            Book a Service
          </h1>
        </div>

        {/* Step indicator */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex items-center gap-0 min-w-max">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`text-[10px] tracking-[0.15em] transition-colors duration-300 ${i <= step ? "text-[#C9A86A]" : "text-[#333]"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className={`text-[9px] tracking-widest uppercase transition-colors duration-300 ${i === step ? "text-[#8A8A8A]" : "text-[#333]"}`}>
                    {label}
                  </div>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`w-10 md:w-14 h-px mx-3 transition-colors duration-500 ${i < step ? "bg-[#C9A86A]" : "bg-[#1A1A1A]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">

          {/* 0 — Service */}
          {step === 0 && (
            <motion.div key="s0" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Choose Your Service</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map(s => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      data-testid={`svc-${s.id}`}
                      onClick={() => setService(s.id)}
                      className={`group text-left p-6 border transition-all duration-200 ${service === s.id ? "border-[#C9A86A] bg-[#111111]" : "border-[#1A1A1A] bg-[#111111] hover:border-[#C9A86A]/40"}`}
                    >
                      <Icon size={15} className={`mb-4 transition-colors ${service === s.id ? "text-[#C9A86A]" : "text-[#8A8A8A] group-hover:text-[#C9A86A]"}`} />
                      <h3 className={`font-serif text-base mb-1 transition-colors ${service === s.id ? "text-[#C9A86A]" : "text-[#F5F5F5]"}`}>{s.label}</h3>
                      <p className="text-[#8A8A8A] text-xs leading-relaxed">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 1 — Technician */}
          {step === 1 && (
            <motion.div key="s1" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Select Your Technician</p>
              <div className="space-y-3">
                {TECHNICIANS.map(t => (
                  <button
                    key={t.id}
                    data-testid={`tech-${t.id}`}
                    onClick={() => setTech(t.id)}
                    className={`w-full group text-left p-6 border transition-all duration-200 ${tech === t.id ? "border-[#C9A86A] bg-[#111111]" : "border-[#1A1A1A] bg-[#111111] hover:border-[#C9A86A]/40"}`}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`w-11 h-11 border flex-shrink-0 flex items-center justify-center font-serif text-xs tracking-wider transition-colors ${tech === t.id ? "border-[#C9A86A] text-[#C9A86A]" : "border-[#1A1A1A] text-[#8A8A8A]"}`}>
                        {t.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-serif text-base transition-colors ${tech === t.id ? "text-[#C9A86A]" : "text-[#F5F5F5]"}`}>{t.name}</h3>
                          <span className="text-[#8A8A8A] text-[11px]">{t.years} yrs</span>
                        </div>
                        <p className="text-[#C9A86A]/60 text-[11px] tracking-wide mb-1.5">{t.specialty}</p>
                        <p className="text-[#8A8A8A] text-xs leading-relaxed">{t.bio}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 2 — Date */}
          {step === 2 && (
            <motion.div key="s2" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Choose a Date</p>
              <Calendar selected={date} onSelect={setDate} />
              {date && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[#8A8A8A] text-xs mt-4 tracking-wide">
                  {fmtDate(date)}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* 3 — Time */}
          {step === 3 && (
            <motion.div key="s3" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Select Arrival Time</p>
              <div className="space-y-2.5">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot.id}
                    data-testid={`slot-${slot.id}`}
                    onClick={() => setTime(slot.id)}
                    className={`w-full flex items-center justify-between px-6 py-5 border transition-all duration-200 ${time === slot.id ? "border-[#C9A86A] bg-[#111111]" : "border-[#1A1A1A] bg-[#111111] hover:border-[#C9A86A]/40"}`}
                  >
                    <div className="flex items-center gap-5">
                      <span className={`font-serif text-xl transition-colors ${time === slot.id ? "text-[#C9A86A]" : "text-[#F5F5F5]"}`}>{slot.label}</span>
                      <span className="text-[#8A8A8A] text-[10px] tracking-widest uppercase">{slot.period}</span>
                    </div>
                    {time === slot.id && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4 — Details */}
          {step === 4 && (
            <motion.div key="s4" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Your Details</p>
              <div className="space-y-4">
                {([
                  { key: "name", label: "Full Name", placeholder: "Jonathan Williams", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "j.williams@email.com", type: "email" },
                  { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel" },
                  { key: "vehicle", label: "Vehicle (Year, Make, Model)", placeholder: "2023 Porsche 911 GT3", type: "text" },
                ] as const).map(field => (
                  <div key={field.key}>
                    <label className="block text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-2">{field.label}</label>
                    <input
                      data-testid={`input-${field.key}`}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-3.5 text-sm placeholder:text-[#333] focus:outline-none focus:border-[#C9A86A]/50 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-2">Notes (Optional)</label>
                  <textarea
                    data-testid="input-notes"
                    placeholder="Any specific concerns or requests…"
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-[#111111] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-3.5 text-sm placeholder:text-[#333] focus:outline-none focus:border-[#C9A86A]/50 transition-colors resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* 5 — Review */}
          {step === 5 && (
            <motion.div key="s5" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Review & Confirm</p>
              <div className="bg-[#111111] border border-[#1A1A1A] p-8 mb-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Service", value: selService?.label },
                    { label: "Technician", value: selTech?.name },
                    { label: "Date", value: date ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
                    { label: "Time", value: selSlot?.label },
                    { label: "Name", value: form.name },
                    { label: "Vehicle", value: form.vehicle },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-1.5">{item.label}</p>
                      <p className="text-[#F5F5F5] text-sm">{item.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[#8A8A8A] text-[11px] leading-relaxed text-center">
                By submitting, you authorize BLACKLINE AUTO STUDIO to contact you to confirm this appointment.
              </p>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-[#1A1A1A]">
          <button
            data-testid="button-back"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors disabled:opacity-20 text-[11px] tracking-[0.15em] uppercase"
          >
            <ChevronLeft size={14} />
            Back
          </button>

          {step < 5 ? (
            <button
              data-testid="button-next"
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext}
              className="flex items-center gap-2 bg-[#C9A86A] text-[#070707] px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              data-testid="button-confirm"
              onClick={handleConfirm}
              disabled={loading}
              className="flex items-center gap-2.5 bg-[#C9A86A] text-[#070707] px-10 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  Confirm Booking
                  <Check size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
