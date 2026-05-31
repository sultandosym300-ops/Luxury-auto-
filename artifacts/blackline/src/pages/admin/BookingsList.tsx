import { useEffect, useState } from "react";
import { get, patch } from "@/lib/api";
import type { BookingWithRels, BookingStatus } from "@/lib/api";

const STATUSES: { value: BookingStatus; label: string }[] = [
  { value: "quote_requested", label: "Quote Requested" },
  { value: "scheduled", label: "Scheduled" },
  { value: "vehicle_received", label: "Vehicle Received" },
  { value: "preparation", label: "Preparation" },
  { value: "in_progress", label: "In Progress" },
  { value: "quality_inspection", label: "Quality Inspection" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function BookingsList() {
  const [bookings, setBookings] = useState<BookingWithRels[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    get<BookingWithRels[]>("/admin/bookings")
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (bookingId: number, status: BookingStatus) => {
    setUpdating(bookingId);
    try {
      const updated = await patch<{ id: number; status: BookingStatus }>(`/admin/bookings/${bookingId}/status`, {
        status,
        note: statusNote || undefined,
      });
      setBookings(bs => bs.map(b =>
        b.booking.id === bookingId ? { ...b, booking: { ...b.booking, status: updated.status } } : b
      ));
      setStatusNote("");
      setExpanded(null);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-1 h-8 bg-[#C9A86A] animate-pulse" />
    </div>
  );

  return (
    <div>
      <div className="mb-10">
        <p className="text-[#C9A86A] tracking-[0.3em] text-[10px] uppercase mb-2">Manage</p>
        <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight">Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="border border-[#1A1A1A] bg-[#111111] p-14 text-center">
          <p className="text-[#8A8A8A] text-sm">No bookings yet.</p>
          <p className="text-[#333] text-xs mt-2">Customer appointments will appear here.</p>
        </div>
      ) : (
        <div className="border border-[#1A1A1A] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Reference", "Customer", "Vehicle", "Service", "Date", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(({ booking, service, technician }, i) => (
                <>
                  <tr key={booking.id} className={`border-b border-[#1A1A1A] ${i % 2 === 0 ? "bg-[#070707]" : "bg-[#111111]"}`}>
                    <td className="px-4 py-4 text-sm text-[#C9A86A] font-mono">{booking.reference}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#F5F5F5]">{booking.contactName}</p>
                      <p className="text-[10px] text-[#8A8A8A]">{booking.contactEmail}</p>
                    </td>
                    <td className="px-4 py-4 text-xs text-[#8A8A8A] max-w-[120px] truncate">{booking.vehicleDescription ?? "—"}</td>
                    <td className="px-4 py-4 text-xs text-[#8A8A8A]">{service?.name ?? "—"}</td>
                    <td className="px-4 py-4 text-xs text-[#8A8A8A]">
                      {booking.appointmentDate
                        ? new Date(booking.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] tracking-wider px-2 py-1 border border-[#C9A86A]/20 text-[#C9A86A]/80 whitespace-nowrap">
                        {STATUSES.find(s => s.value === booking.status)?.label ?? booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setExpanded(expanded === booking.id ? null : booking.id)}
                        className="text-[10px] tracking-wide text-[#8A8A8A] hover:text-[#F5F5F5] uppercase transition-colors"
                      >
                        {expanded === booking.id ? "Close" : "Manage"}
                      </button>
                    </td>
                  </tr>
                  {expanded === booking.id && (
                    <tr key={`${booking.id}-expand`} className="bg-[#111111]">
                      <td colSpan={7} className="px-6 py-5 border-b border-[#1A1A1A]">
                        <div className="flex flex-wrap items-end gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-2">Update Status</label>
                            <select
                              defaultValue={booking.status}
                              onChange={e => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                              disabled={updating === booking.id}
                              className="bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50 min-w-[200px]"
                            >
                              {STATUSES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.15em] text-[#8A8A8A] uppercase mb-2">Note (optional)</label>
                            <input
                              value={statusNote}
                              onChange={e => setStatusNote(e.target.value)}
                              placeholder="Add a status note…"
                              className="bg-[#070707] border border-[#1A1A1A] text-[#F5F5F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]/50 w-64 placeholder:text-[#333]"
                            />
                          </div>
                          <div className="flex gap-3 text-[10px] text-[#8A8A8A] self-end pb-1">
                            <span>Phone: {booking.contactPhone}</span>
                            {technician && <span>Tech: {technician.name}</span>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
