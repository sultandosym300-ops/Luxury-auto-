import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";

import heroImg from "@/assets/hero.png";
import port1 from "@/assets/portfolio-1.png";
import port2 from "@/assets/portfolio-2.png";
import port3 from "@/assets/portfolio-3.png";
import port4 from "@/assets/portfolio-4.png";
import ctaImg from "@/assets/cta.png";

// ─── data ───────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    num: "01",
    name: "Paint Protection Film",
    abbr: "PPF",
    desc: "Full-body armor against chips, scratches, and road debris. Self-healing film that keeps your paint flawless for a decade.",
    benefits: ["Self-healing technology", "10-year manufacturer warranty", "Completely invisible finish"],
    price: "$2,500",
    duration: "3–5 days",
  },
  {
    num: "02",
    name: "Ceramic Coating",
    abbr: "CERAMIC",
    desc: "Permanent hydrophobic protection that bonds at the molecular level, delivering mirror-like gloss and chemical resistance.",
    benefits: ["Extreme depth of gloss", "Chemical & UV resistance", "Hydrophobic water beading"],
    price: "$1,200",
    duration: "1–2 days",
  },
  {
    num: "03",
    name: "Paint Correction",
    abbr: "CORRECTION",
    desc: "Multi-stage machine polishing that removes swirl marks, scratches, and oxidation to restore showroom clarity.",
    benefits: ["Removes 95%+ of surface defects", "Restores true paint clarity", "Prepares for ceramic coating"],
    price: "$800",
    duration: "1–3 days",
  },
  {
    num: "04",
    name: "Window Tint",
    abbr: "TINT",
    desc: "Premium automotive film engineered for maximum UV rejection, heat reduction, and visual privacy.",
    benefits: ["99% UV rejection", "Significant heat reduction", "Enhanced privacy & security"],
    price: "$350",
    duration: "4–6 hours",
  },
  {
    num: "05",
    name: "Full Detail",
    abbr: "DETAIL",
    desc: "A complete interior and exterior restoration touching every surface — paint, glass, leather, rubber, and trim.",
    benefits: ["Deep exterior decontamination", "Interior steam clean", "Engine bay detailing"],
    price: "$450",
    duration: "6–8 hours",
  },
  {
    num: "06",
    name: "Interior Restoration",
    abbr: "INTERIOR",
    desc: "Comprehensive cabin revitalization — leather conditioning, stain extraction, steam cleaning, and panel restoration.",
    benefits: ["Leather conditioning & repair", "Professional stain extraction", "Odor elimination treatment"],
    price: "$600",
    duration: "1 day",
  },
];

const PORTFOLIO = [
  { img: port1, name: "McLaren 720S", service: "Full Body PPF", year: "2023", wide: true },
  { img: port2, name: "Lamborghini Huracán", service: "Ceramic Coating", year: "2024", wide: false },
  { img: port3, name: "Rolls-Royce Ghost", service: "Interior Restoration", year: "2022", wide: false },
  { img: port4, name: "Ferrari Roma", service: "Paint Correction", year: "2023", wide: true },
];

const TESTIMONIALS = [
  {
    quote: "When I purchased my GT3 RS, I didn't want just anyone touching the paint. Blackline treated the car with more respect than the dealership. The PPF is completely invisible.",
    name: "David K.",
    vehicle: "2024 Porsche 911 GT3 RS",
  },
  {
    quote: "The paint correction result was unbelievable. Swirls I thought were permanent are completely gone. The ceramic coating made it look better than the day I picked it up from the factory.",
    name: "Marcus T.",
    vehicle: "2023 Lamborghini Urus",
  },
  {
    quote: "I've used detailers in three cities. None of them come close. The process, the communication, the result — it's a different level entirely.",
    name: "Rachel C.",
    vehicle: "2022 Ferrari Roma",
  },
];

const STANDARDS = [
  {
    heading: "XPEL & 3M Certified",
    body: "Exclusive access to the highest tier of automotive films, installed by factory-certified technicians.",
  },
  {
    heading: "Climate-Controlled Studio",
    body: "ISO-certified clean room environments guarantee contamination-free ceramic and film applications.",
  },
  {
    heading: "Concierge Logistics",
    body: "Enclosed, fully-insured transport available for pickup and delivery anywhere in the metro area.",
  },
  {
    heading: "Lifetime Support",
    body: "Every coating and film package includes complimentary annual inspections and maintenance guidance.",
  },
];

// ─── micro components ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-5 font-sans font-medium">
      {children}
    </p>
  );
}

function SectionHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl text-[#F5F5F5] leading-[1.05] tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

// ─── container ───────────────────────────────────────────────────────────────

const CX = "max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16";

// ─── page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-[#070707] text-[#F5F5F5] overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-[100dvh] min-h-[640px] flex flex-col justify-center overflow-hidden">
        {/* Background image with controlled overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.45 }}
          />
          {/* Top fade — darkens behind the nav */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, #070707 0%, transparent 30%, transparent 60%, #070707 100%)"
          }} />
        </div>

        {/* Content */}
        <div className={`${CX} relative z-10 pt-24`}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-[#C9A86A] text-[11px] tracking-[0.4em] uppercase mb-6 font-sans"
          >
            Obsessive Craftsmanship
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-[0.06em] text-[#F5F5F5] mb-4"
          >
            BLACKLINE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-[#8A8A8A] text-base md:text-lg max-w-sm mb-10 leading-relaxed"
          >
            Precision automotive protection for vehicles that deserve nothing less.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/quote"
              data-testid="button-hero-quote"
              className="inline-flex items-center justify-center bg-[#C9A86A] text-[#070707] px-8 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors duration-200"
            >
              Request a Quote
            </Link>
            <a
              href="#portfolio"
              data-testid="button-hero-portfolio"
              className="inline-flex items-center justify-center border border-[#1A1A1A] text-[#8A8A8A] px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors duration-200"
            >
              View Portfolio
            </a>
          </motion.div>
        </div>

        {/* Stats — pinned to bottom, always above the image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="absolute bottom-0 left-0 right-0 z-10 border-t border-[#1A1A1A]"
        >
          <div className={`${CX} grid grid-cols-3`}>
            {[
              { value: "500+", label: "Vehicles Protected" },
              { value: "12", label: "Years of Mastery" },
              { value: "100%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`py-6 text-center ${i > 0 ? "border-l border-[#1A1A1A]" : ""}`}
              >
                <p className="font-serif text-2xl md:text-3xl text-[#F5F5F5] mb-1">{stat.value}</p>
                <p className="text-[#8A8A8A] text-[10px] tracking-[0.2em] uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section id="services" className="py-28 md:py-40 border-t border-[#1A1A1A]">
        <div className={CX}>
          {/* Header */}
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
            <div>
              <Label>Our Services</Label>
              <SectionHeading>Engineered Beauty.</SectionHeading>
            </div>
            <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-xs md:text-right md:pb-1">
              Every service executed with absolute precision, utilizing the world's most advanced protection systems.
            </p>
          </FadeIn>

          {/* Service grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1A]">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.06}>
                <div className="bg-[#070707] p-8 md:p-10 group hover:bg-[#0d0d0d] transition-colors duration-300 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[#1A1A1A] font-serif text-4xl leading-none select-none">{s.num}</span>
                    <span className="text-[#C9A86A] text-[10px] tracking-[0.25em] uppercase">{s.abbr}</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#F5F5F5] mb-3 group-hover:text-[#C9A86A] transition-colors duration-300">
                    {s.name}
                  </h3>
                  <p className="text-[#8A8A8A] text-sm leading-relaxed mb-6 flex-1">{s.desc}</p>
                  <ul className="space-y-2 mb-8 pt-5 border-t border-[#1A1A1A]">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-[13px] text-[#8A8A8A]">
                        <span className="w-1 h-1 bg-[#C9A86A] rounded-full flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-end justify-between pt-4 border-t border-[#1A1A1A]">
                    <div>
                      <p className="text-[10px] text-[#8A8A8A] tracking-[0.2em] uppercase mb-1">Starting At</p>
                      <p className="font-serif text-xl text-[#F5F5F5]">{s.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#8A8A8A] tracking-[0.2em] uppercase mb-1">Duration</p>
                      <p className="text-[13px] text-[#F5F5F5]">{s.duration}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-14 flex justify-center">
            <Link
              href="/quote"
              data-testid="button-services-quote"
              className="border border-[#1A1A1A] text-[#8A8A8A] px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors duration-200"
            >
              Get an Estimate
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── PORTFOLIO ────────────────────────────────────────────────── */}
      <section id="portfolio" className="py-28 md:py-40 border-t border-[#1A1A1A]">
        <div className={CX}>
          <FadeIn className="text-center mb-20">
            <Label>The Gallery</Label>
            <SectionHeading>Museum Quality.</SectionHeading>
          </FadeIn>

          {/* 2-column masonry-style grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PORTFOLIO.map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div
                  className={`group relative overflow-hidden bg-[#111111] ${item.wide ? "md:col-span-1" : "md:col-span-1"}`}
                  style={{ aspectRatio: i === 0 || i === 3 ? "16/10" : "4/3" }}
                  data-testid={`portfolio-item-${i}`}
                >
                  <img
                    src={item.img}
                    alt={`${item.name} — ${item.service}`}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    style={{ opacity: 0.75 }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#070707]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Caption — always visible at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#070707]/90 to-transparent">
                    <p className="text-[#C9A86A] text-[10px] tracking-[0.25em] uppercase mb-1.5">
                      {item.service} &middot; {item.year}
                    </p>
                    <h4 className="font-serif text-xl text-[#F5F5F5]">{item.name}</h4>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-14 flex justify-center">
            <Link
              href="/booking"
              data-testid="button-portfolio-book"
              className="inline-flex items-center gap-3 text-[#C9A86A] text-[11px] tracking-[0.25em] uppercase border-b border-[#C9A86A]/40 pb-1 hover:border-[#C9A86A] transition-colors duration-200"
            >
              Reserve Your Appointment
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── STANDARDS ────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 border-t border-[#1A1A1A] bg-[#070707]">
        <div className={CX}>
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn>
              <Label>The Standard</Label>
              <SectionHeading className="mb-8">
                Precision that<br />takes 72 hours.
              </SectionHeading>
              <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-sm">
                We do not rush. A true paint correction and protection process is a labor-intensive operation requiring specialized environments, controlled lighting, and decades of combined experience.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="space-y-8">
                {STANDARDS.map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 pt-1">
                      <div className="w-[1px] h-full min-h-[48px] bg-[#C9A86A]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[17px] text-[#F5F5F5] mb-2">{s.heading}</h3>
                      <p className="text-[#8A8A8A] text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 border-t border-[#1A1A1A]">
        <div className={CX}>
          <FadeIn className="text-center mb-20">
            <Label>Client Voices</Label>
            <SectionHeading>Trusted by collectors.</SectionHeading>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1A1A1A]">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#070707] p-8 md:p-10 flex flex-col h-full">
                  <span className="font-serif text-5xl text-[#1A1A1A] leading-none mb-6 select-none">&ldquo;</span>
                  <p className="text-[#8A8A8A] text-sm leading-relaxed flex-1 italic mb-8">{t.quote}</p>
                  <div className="pt-5 border-t border-[#1A1A1A]">
                    <p className="text-[#C9A86A] text-[11px] tracking-[0.2em] uppercase mb-1">{t.name}</p>
                    <p className="text-[#8A8A8A] text-xs">{t.vehicle}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={ctaImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, #070707 0%, transparent 40%, #070707 100%)"
          }} />
        </div>

        <div className={`${CX} relative z-10 py-32 md:py-48 text-center`}>
          <FadeIn>
            <Label>Begin Here</Label>
            <SectionHeading className="mb-6 max-w-2xl mx-auto">
              Your vehicle deserves perfection.
            </SectionHeading>
            <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-sm mx-auto mb-12">
              Configure your custom protection package and receive a precise estimate in minutes.
            </p>
            <Link
              href="/quote"
              data-testid="button-cta-quote"
              className="inline-flex items-center justify-center bg-[#C9A86A] text-[#070707] px-10 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors duration-200"
            >
              Build Your Package
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
