import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { get } from "@/lib/api";
import type { Booking, BookingTimeline } from "@/lib/api";

const STATUSES = [
  { key: "quote_requested",   label: "Quote Requested" },
  { key: "scheduled",         label: "Scheduled" },
  { key: "vehicle_received",  label: "Vehicle Received" },
  { key: "preparation",       label: "Preparation" },
  { key: "in_progress",       label: "In Progress" },
  { key: "quality_inspection",label: "Quality Inspection" },
  { key: "ready_for_pickup",  label: "Ready for Pickup" },
  { key: "completed",         label: "Completed" },
] as const;

const CX = "max-w-[680px] mx-auto px-6";

function daysUntil(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Track() {
  const [, params] = useRoute("/track/:reference");
  const reference = params?.reference ?? "";
  const [data, setData] = useState<{ booking: Booking; timeline: BookingTimeline[] } | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!reference) return;
    get<{ booking: Booking; timeline: BookingTimeline[] }>(`/bookings/track/${reference}`)
      .then(setData)
      .catch(() => setNotFound(true));
  }, [reference]);

  const currentIdx = data
    ? STATUSES.findIndex(s => s.key === data.booking.status)
    : -1;

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] pt-28 pb-40">
      <div className={CX}>
        <div className="mb-14">
          <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-4">Appointment Status</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F5F5F5] tracking-tight leading-none">
            Track Your Service
          </h1>
        </div>

        {!reference && (
          <TrackSearch />
        )}

        {reference && notFound && (
          <div className="bg-[#111111] border border-[#1A1A1A] p-10 text-center">
            <p className="text-[#8A8A8A] text-sm">No booking found for <span className="text-[#F5F5F5]">{reference}</span>.</p>
          </div>
        )}

        {data && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Header card */}
            <div className="bg-[#111111] border border-[#1A1A1A] p-8 mb-8">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <p className="text-[#C9A86A] text-[11px] tracking-[0.25em] uppercase mb-1">{data.booking.reference}</p>
                  <h2 className="font-serif text-2xl text-[#F5F5F5]">{data.booking.contactName}</h2>
                  {data.booking.vehicleDescription && (
                    <p className="text-[#8A8A8A] text-sm mt-1">{data.booking.vehicleDescription}</p>
                  )}
                </div>
                {data.booking.appointmentDate && (
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-1">Appointment</p>
                    <p className="text-[#F5F5F5] text-sm">{fmtDate(data.booking.appointmentDate)}</p>
                    {(() => {
                      const d = daysUntil(data.booking.appointmentDate);
                      return d ? <p className="text-[#C9A86A] text-xs mt-1">{d}</p> : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C9A86A]/30 bg-[#C9A86A]/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
                <span className="text-[#C9A86A] text-[11px] tracking-[0.15em] uppercase">
                  {STATUSES.find(s => s.key === data.booking.status)?.label ?? data.booking.status}
                </span>
              </div>
            </div>

            {/* Progress timeline */}
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-6">Service Progress</p>
              <div className="space-y-0">
                {STATUSES.map((s, i) => {
                  const done = i < currentIdx;
                  const active = i === currentIdx;
                  const pending = i > currentIdx;
                  const timelineEntry = data.timeline.find(t => t.status === s.key);
                  return (
                    <div key={s.key} className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1 ${
                          active ? "border-[#C9A86A] bg-[#C9A86A]" :
                          done   ? "border-[#C9A86A] bg-[#C9A86A]/30" :
                                   "border-[#1A1A1A] bg-transparent"
                        }`} />
                        {i < STATUSES.length - 1 && (
                          <div className={`w-px flex-1 my-1 ${done || active ? "bg-[#C9A86A]/30" : "bg-[#1A1A1A]"}`}
                            style={{ minHeight: "24px" }} />
                        )}
                      </div>
                      <div className={`pb-5 flex-1 ${i === STATUSES.length - 1 ? "pb-0" : ""}`}>
                        <p className={`text-sm font-medium mb-0.5 ${
                          active ? "text-[#C9A86A]" : done ? "text-[#F5F5F5]" : "text-[#333]"
                        }`}>{s.label}</p>
                        {timelineEntry?.note && (
                          <p className="text-[#8A8A8A] text-xs">{timelineEntry.note}</p>
                        )}
                        {timelineEntry?.createdAt && (
                          <p className="text-[#333] text-[10px] mt-0.5">
                            {new Date(timelineEntry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function TrackSearch() {
  const [ref, setRef] = useState("");
  const [, setLocation] = useState("");
  return (
    <div className="bg-[#111111] border border-[#1A1A1A] p-8">
      <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-4">Enter Booking Reference</p>
      <div className="flex gap-3">
        <input
          value={ref}
          onChange={e => setRef(e.target.value.toUpperCase())}
          placeholder="BL-2026-1048"
          className="flex-1 bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-3 text-sm placeholder:text-[#333] focus:outline-none focus:border-[#C9A86A]/50 transition-colors font-mono tracking-widest"
          onKeyDown={e => { if (e.key === "Enter" && ref) window.location.href = `/track/${ref}`; }}
        />
        <button
          onClick={() => { if (ref) window.location.href = `/track/${ref}`; }}
          disabled={!ref}
          className="bg-[#C9A86A] text-[#070707] px-6 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-[#b8974f] transition-colors disabled:opacity-30"
        >
          Track
        </button>
      </div>
    </div>
  );
}
