import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Shield, Droplets, Wrench, Sun, Sparkles, Armchair } from "lucide-react";

const services = [
  { id: "ppf", label: "Paint Protection Film", icon: Shield, desc: "Full-body armor against road hazards" },
  { id: "ceramic", label: "Ceramic Coating", icon: Droplets, desc: "Permanent hydrophobic protection" },
  { id: "tint", label: "Window Tint", icon: Sun, desc: "Premium automotive film installation" },
  { id: "paint", label: "Paint Correction", icon: Wrench, desc: "Multi-stage swirl removal" },
  { id: "detail", label: "Full Detail", icon: Sparkles, desc: "Complete interior & exterior restoration" },
  { id: "interior", label: "Interior Restoration", icon: Armchair, desc: "Leather, panels, and deep cleaning" },
];

const technicians = [
  {
    id: "marcus",
    name: "Marcus Rivera",
    specialty: "PPF & Ceramic Specialist",
    years: 9,
    bio: "Certified XPEL installer. Specializes in full-body PPF and multi-layer ceramic systems for exotic vehicles.",
    initials: "MR",
  },
  {
    id: "jordan",
    name: "Jordan Hayes",
    specialty: "Paint Correction Expert",
    years: 7,
    bio: "DA and rotary machine specialist. Has restored paint on over 300 high-end vehicles.",
    initials: "JH",
  },
  {
    id: "alex",
    name: "Alex Chen",
    specialty: "Full Detail & Interior",
    years: 5,
    bio: "Master-level interior restoration. Trained in leather repair, steam cleaning, and odor elimination.",
    initials: "AC",
  },
  {
    id: "sarah",
    name: "Sarah Kim",
    specialty: "Window Film Specialist",
    years: 6,
    bio: "3M certified installer. Precision film cuts, zero bubbles, lifetime warranty on all installations.",
    initials: "SK",
  },
];

const timeSlots = [
  { id: "0800", label: "8:00 AM", period: "Morning" },
  { id: "1000", label: "10:00 AM", period: "Morning" },
  { id: "1200", label: "12:00 PM", period: "Afternoon" },
  { id: "1400", label: "2:00 PM", period: "Afternoon" },
  { id: "1600", label: "4:00 PM", period: "Late Afternoon" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function Calendar({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || d.getDay() === 0;
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    );
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  return (
    <div className="border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <ChevronLeft size={16} />
        </button>
        <span className="font-serif text-lg text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <button
              key={day}
              data-testid={`calendar-day-${day}`}
              disabled={isDisabled(day)}
              onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
              className={`
                h-9 w-full text-sm transition-all duration-200
                ${isSelected(day) ? "bg-primary text-primary-foreground" : ""}
                ${!isSelected(day) && !isDisabled(day) ? "text-foreground hover:bg-card hover:text-primary hover:border hover:border-primary/30" : ""}
                ${isDisabled(day) ? "text-border cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {day}
            </button>
          )
        )}
      </div>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

const stepLabels = ["Service", "Technician", "Date", "Time", "Details", "Confirm"];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [technician, setTechnician] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", vehicle: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const canProceed =
    (step === 0 && service) ||
    (step === 1 && technician) ||
    (step === 2 && date) ||
    (step === 3 && time) ||
    (step === 4 && form.name && form.email && form.phone && form.vehicle) ||
    step === 5;

  const selectedService = services.find((s) => s.id === service);
  const selectedTechnician = technicians.find((t) => t.id === technician);
  const selectedSlot = timeSlots.find((t) => t.id === time);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-lg"
        >
          <div className="w-14 h-14 border border-primary flex items-center justify-center mx-auto mb-8">
            <Check size={22} className="text-primary" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4 tracking-tight">Booking Received</h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Your appointment request has been submitted. {selectedTechnician?.name} will reach out within 24 hours to confirm your booking.
          </p>
          <div className="border border-border bg-card p-8 text-left mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1.5">Service</p>
                <p className="text-foreground text-sm">{selectedService?.label}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1.5">Technician</p>
                <p className="text-foreground text-sm">{selectedTechnician?.name}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1.5">Date</p>
                <p className="text-foreground text-sm">{date ? formatDate(date) : "—"}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1.5">Time</p>
                <p className="text-foreground text-sm">{selectedSlot?.label}</p>
              </div>
            </div>
          </div>
          <a href="/" className="text-muted-foreground hover:text-foreground transition-colors text-xs tracking-[0.2em] uppercase">
            Return Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-40 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary tracking-[0.35em] text-xs uppercase mb-4">Reserve Your Appointment</p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground tracking-tight leading-none">
            Book a Service
          </h1>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-14 px-2">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`text-xs tracking-widest transition-all duration-300 ${
                  i === step ? "text-primary" : i < step ? "text-primary/40" : "text-border"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className={`hidden md:block text-[10px] tracking-wider uppercase transition-all duration-300 ${
                  i === step ? "text-muted-foreground" : "text-border"
                }`}
              >
                {label}
              </div>
              <div
                className={`h-[1px] w-8 md:w-12 transition-all duration-500 ${
                  i < step ? "bg-primary" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 0: Service */}
          {step === 0 && (
            <motion.div key="step0" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">Choose Your Service</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      data-testid={`booking-service-${s.id}`}
                      onClick={() => setService(s.id)}
                      className={`group text-left p-6 border transition-all duration-300 ${
                        service === s.id ? "border-primary bg-card" : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`mb-4 transition-colors ${service === s.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                      />
                      <h3 className={`font-serif text-base mb-1 transition-colors ${service === s.id ? "text-primary" : "text-foreground"}`}>
                        {s.label}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 1: Technician */}
          {step === 1 && (
            <motion.div key="step1" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">Select Your Technician</p>
              <div className="grid grid-cols-1 gap-3">
                {technicians.map((t) => (
                  <button
                    key={t.id}
                    data-testid={`technician-${t.id}`}
                    onClick={() => setTechnician(t.id)}
                    className={`group text-left p-6 border transition-all duration-300 ${
                      technician === t.id ? "border-primary bg-card" : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className={`w-12 h-12 border flex-shrink-0 flex items-center justify-center font-serif text-sm tracking-wider transition-all duration-300 ${
                          technician === t.id ? "border-primary text-primary" : "border-border text-muted-foreground"
                        }`}
                      >
                        {t.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-serif text-lg transition-colors ${technician === t.id ? "text-primary" : "text-foreground"}`}>
                            {t.name}
                          </h3>
                          <span className="text-muted-foreground text-xs">{t.years} yrs</span>
                        </div>
                        <p className="text-primary/70 text-xs tracking-wide mb-2">{t.specialty}</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">{t.bio}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Date */}
          {step === 2 && (
            <motion.div key="step2" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">Choose a Date</p>
              <Calendar selected={date} onSelect={setDate} />
              {date && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground text-sm mt-4"
                >
                  {formatDate(date)}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Step 3: Time */}
          {step === 3 && (
            <motion.div key="step3" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">Select Arrival Time</p>
              <div className="grid grid-cols-1 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    data-testid={`time-${slot.id}`}
                    onClick={() => setTime(slot.id)}
                    className={`flex items-center justify-between p-5 border transition-all duration-300 ${
                      time === slot.id ? "border-primary bg-card" : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={`font-serif text-2xl transition-colors ${time === slot.id ? "text-primary" : "text-foreground"}`}
                      >
                        {slot.label}
                      </span>
                      <span className="text-muted-foreground text-xs tracking-wider uppercase">{slot.period}</span>
                    </div>
                    {time === slot.id && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <motion.div key="step4" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">Your Details</p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { key: "name", label: "Full Name", placeholder: "Jonathan Williams", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "j.williams@email.com", type: "email" },
                  { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel" },
                  { key: "vehicle", label: "Vehicle (Year, Make, Model)", placeholder: "2023 Porsche 911 GT3", type: "text" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs tracking-[0.2em] text-muted-foreground uppercase block mb-2">
                      {field.label}
                    </label>
                    <input
                      data-testid={`input-${field.key}`}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-card border border-border text-foreground px-4 py-3.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs tracking-[0.2em] text-muted-foreground uppercase block mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    data-testid="input-notes"
                    placeholder="Any specific concerns or requests..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-card border border-border text-foreground px-4 py-3.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <motion.div key="step5" {...fadeUp}>
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">Review & Confirm</p>
              <div className="border border-border bg-card p-8 mb-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Service", value: selectedService?.label },
                    { label: "Technician", value: selectedTechnician?.name },
                    { label: "Date", value: date ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
                    { label: "Time", value: selectedSlot?.label },
                    { label: "Name", value: form.name },
                    { label: "Vehicle", value: form.vehicle },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1.5">{item.label}</p>
                      <p className="text-foreground text-sm">{item.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed text-center mb-2">
                By submitting, you authorize BLACKLINE AUTO STUDIO to contact you to confirm this appointment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            data-testid="button-back"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 text-sm tracking-wide"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {step < 5 ? (
            <button
              data-testid="button-next"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              data-testid="button-confirm"
              onClick={() => setSubmitted(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-3 text-sm font-medium tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Confirm Booking
              <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
