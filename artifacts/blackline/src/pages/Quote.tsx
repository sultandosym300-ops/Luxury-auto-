import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronRight, ChevronLeft, Shield, Droplets, Wrench, Sun, Sparkles, Armchair } from "lucide-react";

// ─── data ────────────────────────────────────────────────────────────────────

const VEHICLES = [
  { id: "sedan",  label: "Sedan",  desc: "4-door luxury, sports, executive",    mult: 1.0 },
  { id: "coupe",  label: "Coupe",  desc: "2-door performance & grand tourers",  mult: 1.1 },
  { id: "suv",    label: "SUV",    desc: "Luxury crossovers & full-size SUVs",  mult: 1.3 },
  { id: "truck",  label: "Truck",  desc: "Full-size pickup trucks",             mult: 1.2 },
  { id: "exotic", label: "Exotic", desc: "Supercars, hypercars, collectors",    mult: 1.5 },
];

const SERVICES = [
  { id: "ppf",      label: "Paint Protection Film", icon: Shield,   base: 2500, dur: "3–5 days",   desc: "Full-body armor against road hazards" },
  { id: "ceramic",  label: "Ceramic Coating",        icon: Droplets, base: 1200, dur: "1–2 days",   desc: "Permanent hydrophobic protection" },
  { id: "tint",     label: "Window Tint",            icon: Sun,      base: 350,  dur: "4–6 hours",  desc: "Premium automotive film installation" },
  { id: "paint",    label: "Paint Correction",       icon: Wrench,   base: 800,  dur: "1–3 days",   desc: "Multi-stage swirl removal" },
  { id: "detail",   label: "Full Detail",            icon: Sparkles, base: 450,  dur: "6–8 hours",  desc: "Complete interior & exterior restoration" },
  { id: "interior", label: "Interior Restoration",   icon: Armchair, base: 600,  dur: "1 day",      desc: "Leather, panels & deep cleaning" },
];

const CONDITIONS = [
  { id: "pristine", label: "Pristine",          desc: "Garaged, rarely driven — no visible flaws", mult: 1.0 },
  { id: "good",     label: "Good",              desc: "Minor swirls, light wash marring",          mult: 1.1 },
  { id: "moderate", label: "Moderate",          desc: "Visible scratches, light oxidation",        mult: 1.3 },
  { id: "heavy",    label: "Heavy Correction",  desc: "Major paint damage, deep scratches",        mult: 1.6 },
];

const PACKAGES: Record<string, string> = {
  ppf:      "Blackline Shield Pro",
  ceramic:  "Blackline Crystal Guard",
  tint:     "Blackline Solar Film",
  paint:    "Blackline Clarity Restore",
  detail:   "Blackline Signature Detail",
  interior: "Blackline Cabin Revival",
};

// ─── animation ───────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

// ─── reusable selection card ──────────────────────────────────────────────────

function SelectCard({
  selected,
  onClick,
  children,
  testId,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`group w-full text-left p-6 border transition-all duration-200 ${
        selected
          ? "border-[#C9A86A] bg-[#111111]"
          : "border-[#1A1A1A] bg-[#111111] hover:border-[#C9A86A]/40"
      }`}
    >
      {children}
    </button>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function Quote() {
  const [step, setStep]           = useState(0);
  const [vehicle, setVehicle]     = useState<string | null>(null);
  const [service, setService]     = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [, setLocation]           = useLocation();

  const selVehicle   = VEHICLES.find(v => v.id === vehicle);
  const selService   = SERVICES.find(s => s.id === service);
  const selCondition = CONDITIONS.find(c => c.id === condition);

  const basePrice = selService?.base ?? 0;
  const low  = Math.round(basePrice * (selVehicle?.mult ?? 1) * (selCondition?.mult ?? 1));
  const high = Math.round(low * 1.2);

  const canNext =
    (step === 0 && !!vehicle) ||
    (step === 1 && !!service) ||
    (step === 2 && !!condition) ||
    step === 3;

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] pt-28 pb-40 px-6">
      <div className="max-w-[680px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-4">Estimate Your Investment</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F5F5F5] tracking-tight leading-none mb-3">
            Quote Calculator
          </h1>
          <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-sm">
            Three steps to a precise estimate tailored to your vehicle and service.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-14">
          {["Vehicle", "Service", "Condition", "Estimate"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col gap-1 flex-1">
                <div className={`h-[2px] transition-all duration-500 ${i <= step ? "bg-[#C9A86A]" : "bg-[#1A1A1A]"}`} />
                <span className={`text-[9px] tracking-[0.15em] uppercase transition-colors ${i === step ? "text-[#8A8A8A]" : i < step ? "text-[#C9A86A]/50" : "text-[#333]"}`}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">

          {/* 0 — Vehicle */}
          {step === 0 && (
            <motion.div key="v" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Select Vehicle Type</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VEHICLES.map(v => (
                  <SelectCard key={v.id} selected={vehicle === v.id} onClick={() => setVehicle(v.id)} testId={`veh-${v.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-serif text-lg transition-colors ${vehicle === v.id ? "text-[#C9A86A]" : "text-[#F5F5F5] group-hover:text-[#C9A86A]"}`}>
                        {v.label}
                      </h3>
                      {vehicle === v.id && <div className="w-1.5 h-1.5 bg-[#C9A86A] rounded-full mt-1.5 flex-shrink-0" />}
                    </div>
                    <p className="text-[#8A8A8A] text-xs leading-relaxed">{v.desc}</p>
                  </SelectCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* 1 — Service */}
          {step === 1 && (
            <motion.div key="s" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Select Service</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map(s => {
                  const Icon = s.icon;
                  return (
                    <SelectCard key={s.id} selected={service === s.id} onClick={() => setService(s.id)} testId={`svc-${s.id}`}>
                      <Icon size={14} className={`mb-4 transition-colors ${service === s.id ? "text-[#C9A86A]" : "text-[#8A8A8A] group-hover:text-[#C9A86A]"}`} />
                      <h3 className={`font-serif text-base mb-1 transition-colors ${service === s.id ? "text-[#C9A86A]" : "text-[#F5F5F5]"}`}>
                        {s.label}
                      </h3>
                      <p className="text-[#8A8A8A] text-xs mb-3">{s.desc}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A]">
                        <span className="text-[#F5F5F5] text-xs">From ${s.base.toLocaleString()}</span>
                        <span className="text-[#8A8A8A] text-[10px]">{s.dur}</span>
                      </div>
                    </SelectCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 2 — Condition */}
          {step === 2 && (
            <motion.div key="c" {...fadeUp}>
              <p className="text-[10px] tracking-[0.3em] text-[#8A8A8A] uppercase mb-5">Vehicle Condition</p>
              <div className="space-y-3">
                {CONDITIONS.map(c => (
                  <SelectCard key={c.id} selected={condition === c.id} onClick={() => setCondition(c.id)} testId={`cond-${c.id}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-serif text-lg mb-1 transition-colors ${condition === c.id ? "text-[#C9A86A]" : "text-[#F5F5F5] group-hover:text-[#C9A86A]"}`}>
                          {c.label}
                        </h3>
                        <p className="text-[#8A8A8A] text-xs">{c.desc}</p>
                      </div>
                      {condition === c.id && <div className="w-1.5 h-1.5 bg-[#C9A86A] rounded-full flex-shrink-0 ml-4" />}
                    </div>
                  </SelectCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3 — Result */}
          {step === 3 && (
            <motion.div key="r" {...fadeUp}>
              <div className="bg-[#111111] border border-[#1A1A1A] p-10 md:p-14 text-center">
                <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-8">Your Estimate</p>

                <div className="mb-10">
                  <div className="font-serif text-[clamp(2.5rem,8vw,4.5rem)] text-[#F5F5F5] leading-none mb-2">
                    ${low.toLocaleString()}
                    <span className="text-[#8A8A8A] text-3xl mx-2">—</span>
                    ${high.toLocaleString()}
                  </div>
                  <p className="text-[#8A8A8A] text-xs tracking-widest uppercase">Estimated Investment</p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#1A1A1A] mb-10 text-left">
                  {[
                    { label: "Package",  value: selService ? PACKAGES[selService.id] : "—" },
                    { label: "Duration", value: selService?.dur ?? "—" },
                    { label: "Vehicle",  value: selVehicle?.label ?? "—" },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-1.5">{item.label}</p>
                      <p className="text-[#F5F5F5] text-xs font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[#8A8A8A] text-[11px] leading-relaxed mb-10 max-w-sm mx-auto">
                  Final pricing is confirmed upon inspection. This estimate reflects typical pricing for your selections and vehicle class.
                </p>

                <button
                  data-testid="button-proceed-booking"
                  onClick={() => setLocation("/booking")}
                  className="bg-[#C9A86A] text-[#070707] px-10 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors"
                >
                  Request This Quote
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-[#1A1A1A]">
          {step < 3 ? (
            <>
              <button
                data-testid="button-back"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors disabled:opacity-20 text-[11px] tracking-[0.15em] uppercase"
              >
                <ChevronLeft size={14} />
                Back
              </button>
              <button
                data-testid="button-next"
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext}
                className="flex items-center gap-2 bg-[#C9A86A] text-[#070707] px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <button
              data-testid="button-restart"
              onClick={() => { setStep(0); setVehicle(null); setService(null); setCondition(null); }}
              className="text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors text-[11px] tracking-[0.2em] uppercase mx-auto"
            >
              Start Over
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
