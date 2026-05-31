import { useEffect, useState } from "react";
import { Link } from "wouter";
import { get } from "@/lib/api";
import type { AnalyticsData, BookingWithRels } from "@/lib/api";

const STATUS_LABELS: Record<string, string> = {
  quote_requested: "Quote", scheduled: "Scheduled", vehicle_received: "Received",
  preparation: "Prep", in_progress: "In Progress", quality_inspection: "Inspection",
  ready_for_pickup: "Ready", completed: "Completed", cancelled: "Cancelled",
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-[#1A1A1A] bg-[#111111] p-6">
      <div className="text-[#8A8A8A] text-[10px] tracking-[0.2em] uppercase mb-4">{label}</div>
      <div className="font-serif text-3xl text-[#F5F5F5]">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [bookings, setBookings] = useState<BookingWithRels[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      get<AnalyticsData>("/admin/analytics"),
      get<BookingWithRels[]>("/admin/bookings"),
    ]).then(([a, b]) => {
      setAnalytics(a);
      setBookings(b.slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-1 h-8 bg-[#C9A86A] animate-pulse" />
    </div>
  );

  return (
    <div>
      <div className="mb-10">
        <p className="text-[#C9A86A] tracking-[0.3em] text-[10px] uppercase mb-2">Overview</p>
        <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight">Dashboard</h1>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total Customers" value={analytics.totalCustomers} />
          <StatCard label="Total Bookings" value={analytics.totalBookings} />
          <StatCard label="Active Now" value={analytics.activeBookings} />
          <StatCard label="Completed" value={analytics.completedBookings} />
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-xl text-[#F5F5F5]">Recent Bookings</h2>
        <Link href="/admin/bookings" className="text-[#C9A86A] text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors">View All</Link>
      </div>

      {bookings.length === 0 ? (
        <div className="border border-[#1A1A1A] bg-[#111111] p-12 text-center">
          <p className="text-[#8A8A8A] text-sm">No bookings yet. They'll appear here once customers book.</p>
        </div>
      ) : (
        <div className="border border-[#1A1A1A] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Reference", "Customer", "Service", "Date", "Status"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(({ booking, service }, i) => (
                <tr key={booking.id} className={`border-b border-[#1A1A1A] last:border-0 ${i % 2 === 0 ? "bg-[#070707]" : "bg-[#111111]"}`}>
                  <td className="px-5 py-4 text-sm text-[#C9A86A] font-mono">{booking.reference}</td>
                  <td className="px-5 py-4 text-sm text-[#F5F5F5]">{booking.contactName}</td>
                  <td className="px-5 py-4 text-sm text-[#8A8A8A]">{service?.name ?? "—"}</td>
                  <td className="px-5 py-4 text-sm text-[#8A8A8A]">
                    {booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] tracking-wider px-2.5 py-1 border border-[#C9A86A]/20 text-[#C9A86A]/80">
                      {STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
