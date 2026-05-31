import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronRight, ChevronLeft, Shield, Droplets, Wrench, Sun, Sparkles, Armchair } from "lucide-react";

const vehicles = [
  { id: "sedan", label: "Sedan", description: "4-door luxury, sports, executive", multiplier: 1.0 },
  { id: "coupe", label: "Coupe", description: "2-door performance & grand tourers", multiplier: 1.1 },
  { id: "suv", label: "SUV", description: "Luxury crossovers & full-size SUVs", multiplier: 1.3 },
  { id: "truck", label: "Truck", description: "Full-size pickup trucks", multiplier: 1.2 },
  { id: "exotic", label: "Exotic", description: "Supercars, hypercars, collector vehicles", multiplier: 1.5 },
];

const services = [
  { id: "ppf", label: "Paint Protection Film", icon: Shield, basePrice: 2500, duration: "3-5 days", desc: "Full-body armor against road hazards" },
  { id: "ceramic", label: "Ceramic Coating", icon: Droplets, basePrice: 1200, duration: "1-2 days", desc: "Permanent hydrophobic protection" },
  { id: "tint", label: "Window Tint", icon: Sun, basePrice: 350, duration: "4-6 hours", desc: "Premium automotive film installation" },
  { id: "paint", label: "Paint Correction", icon: Wrench, basePrice: 800, duration: "1-3 days", desc: "Multi-stage swirl removal" },
  { id: "detail", label: "Full Detail", icon: Sparkles, basePrice: 450, duration: "6-8 hours", desc: "Complete interior & exterior restoration" },
  { id: "interior", label: "Interior Restoration", icon: Armchair, basePrice: 600, duration: "1 day", desc: "Leather, panels, and deep cleaning" },
];

const conditions = [
  { id: "pristine", label: "Pristine", description: "Garaged, rarely driven, no visible flaws", multiplier: 1.0 },
  { id: "good", label: "Good", description: "Minor swirls, light wash marring", multiplier: 1.1 },
  { id: "moderate", label: "Moderate", description: "Visible scratches, light oxidation", multiplier: 1.3 },
  { id: "heavy", label: "Heavy Correction", description: "Major paint damage, deep scratches", multiplier: 1.6 },
];

const packages: Record<string, string> = {
  ppf: "Blackline Shield Pro",
  ceramic: "Blackline Crystal Guard",
  tint: "Blackline Solar Film",
  paint: "Blackline Clarity Restore",
  detail: "Blackline Signature Detail",
  interior: "Blackline Cabin Revival",
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

export default function Quote() {
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const totalSteps = 4;

  const selectedVehicle = vehicles.find((v) => v.id === vehicle);
  const selectedService = services.find((s) => s.id === service);
  const selectedCondition = conditions.find((c) => c.id === condition);

  const basePrice = selectedService?.basePrice ?? 0;
  const vMul = selectedVehicle?.multiplier ?? 1;
  const cMul = selectedCondition?.multiplier ?? 1;
  const low = Math.round(basePrice * vMul * cMul);
  const high = Math.round(basePrice * vMul * cMul * 1.25);

  const canProceed =
    (step === 0 && vehicle) ||
    (step === 1 && service) ||
    (step === 2 && condition) ||
    step === 3;

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-40 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-primary tracking-[0.35em] text-xs uppercase mb-4">Estimate Your Investment</p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground tracking-tight leading-none mb-6">
            Quote Calculator
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Answer three questions to receive a precise estimate tailored to your vehicle.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-16">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-8 h-[1px] transition-all duration-500 ${
                  i <= step ? "bg-primary" : "bg-border"
                }`}
              />
              <div
                className={`text-xs font-medium tracking-widest transition-all duration-500 ${
                  i === step ? "text-primary" : i < step ? "text-primary/50" : "text-border"
                }`}
              >
                0{i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">Vehicle Type</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    data-testid={`vehicle-${v.id}`}
                    onClick={() => setVehicle(v.id)}
                    className={`group text-left p-6 border transition-all duration-300 ${
                      vehicle === v.id
                        ? "border-primary bg-card"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`font-serif text-xl transition-colors duration-300 ${
                          vehicle === v.id ? "text-primary" : "text-foreground group-hover:text-primary"
                        }`}
                      >
                        {v.label}
                      </span>
                      {vehicle === v.id && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">Select Service</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      data-testid={`service-${s.id}`}
                      onClick={() => setService(s.id)}
                      className={`group text-left p-6 border transition-all duration-300 ${
                        service === s.id
                          ? "border-primary bg-card"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Icon
                          size={18}
                          className={`transition-colors duration-300 mt-0.5 ${
                            service === s.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                          }`}
                        />
                        {service === s.id && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                      </div>
                      <h3
                        className={`font-serif text-lg mb-1 transition-colors duration-300 ${
                          service === s.id ? "text-primary" : "text-foreground group-hover:text-primary"
                        }`}
                      >
                        {s.label}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">{s.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-sm font-medium">
                          From ${s.basePrice.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-xs">{s.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">Vehicle Condition</p>
              <div className="grid grid-cols-1 gap-3">
                {conditions.map((c) => (
                  <button
                    key={c.id}
                    data-testid={`condition-${c.id}`}
                    onClick={() => setCondition(c.id)}
                    className={`group text-left p-6 border transition-all duration-300 ${
                      condition === c.id
                        ? "border-primary bg-card"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className={`font-serif text-xl mb-1 transition-colors duration-300 ${
                            condition === c.id ? "text-primary" : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {c.label}
                        </h3>
                        <p className="text-muted-foreground text-sm">{c.description}</p>
                      </div>
                      {condition === c.id && <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...fadeUp}>
              <div className="border border-border bg-card p-10 md:p-14 text-center">
                <p className="text-primary tracking-[0.3em] text-xs uppercase mb-8">Your Estimate</p>

                <div className="mb-10">
                  <div className="font-serif text-6xl md:text-7xl text-foreground mb-2">
                    ${low.toLocaleString()}
                    <span className="text-muted-foreground text-3xl"> – </span>
                    ${high.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground text-sm tracking-wide">Estimated Investment</p>
                </div>

                <div className="border-t border-border pt-8 mb-10 grid grid-cols-3 gap-6 text-left">
                  <div>
                    <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">Package</p>
                    <p className="text-foreground text-sm font-medium">
                      {selectedService ? packages[selectedService.id] : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">Duration</p>
                    <p className="text-foreground text-sm font-medium">
                      {selectedService?.duration ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">Vehicle</p>
                    <p className="text-foreground text-sm font-medium">
                      {selectedVehicle?.label ?? "—"}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed mb-10 max-w-sm mx-auto">
                  Final pricing is confirmed upon inspection. This estimate reflects typical pricing for your selections.
                </p>

                <button
                  data-testid="button-book-now"
                  onClick={() => setLocation("/booking")}
                  className="bg-primary text-primary-foreground px-10 py-4 text-sm font-medium tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  Request This Quote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mt-12"
          >
            <button
              data-testid="button-back"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 text-sm tracking-wide"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <button
              data-testid="button-next"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <button
              data-testid="button-restart"
              onClick={() => { setStep(0); setVehicle(null); setService(null); setCondition(null); }}
              className="text-muted-foreground hover:text-foreground transition-colors text-xs tracking-[0.2em] uppercase"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
