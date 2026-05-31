import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import type { AnalyticsData } from "@/lib/api";

const STATUS_LABELS: Record<string, string> = {
  quote_requested: "Quote Requested", scheduled: "Scheduled",
  vehicle_received: "Vehicle Received", preparation: "Preparation",
  in_progress: "In Progress", quality_inspection: "Quality Inspection",
  ready_for_pickup: "Ready for Pickup", completed: "Completed", cancelled: "Cancelled",
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<AnalyticsData>("/admin/analytics").then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-1 h-8 bg-[#C9A86A] animate-pulse" />
    </div>
  );

  if (!data) return null;

  const maxCount = Math.max(...(data.statusBreakdown.map(s => Number(s.count)) ?? [1]), 1);

  return (
    <div>
      <div className="mb-10">
        <p className="text-[#C9A86A] tracking-[0.3em] text-[10px] uppercase mb-2">Insights</p>
        <h1 className="font-serif text-4xl text-[#F5F5F5] tracking-tight">Analytics</h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total Customers", value: data.totalCustomers },
          { label: "Total Bookings", value: data.totalBookings },
          { label: "Completed Jobs", value: data.completedBookings },
          { label: "Active Right Now", value: data.activeBookings },
          { label: "Revenue Today", value: data.revenueToday > 0 ? `$${data.revenueToday.toLocaleString()}` : "—" },
          { label: "Revenue This Month", value: data.revenueMonth > 0 ? `$${data.revenueMonth.toLocaleString()}` : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="border border-[#1A1A1A] bg-[#111111] p-6">
            <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-3">{label}</p>
            <p className="font-serif text-3xl text-[#F5F5F5]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking status breakdown */}
        <div className="border border-[#1A1A1A] bg-[#111111] p-6">
          <h2 className="font-serif text-lg text-[#F5F5F5] mb-6">Bookings by Status</h2>
          {data.statusBreakdown.length === 0 ? (
            <p className="text-[#8A8A8A] text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {data.statusBreakdown.map(s => {
                const count = Number(s.count);
                const pct = Math.round((count / data.totalBookings) * 100) || 0;
                return (
                  <div key={s.status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[#F5F5F5]">{STATUS_LABELS[s.status] ?? s.status}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#8A8A8A]">{count}</span>
                        <span className="text-xs text-[#C9A86A]">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-[2px] bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A86A] transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Volume chart */}
        <div className="border border-[#1A1A1A] bg-[#111111] p-6">
          <h2 className="font-serif text-lg text-[#F5F5F5] mb-6">Booking Volume</h2>
          {data.statusBreakdown.length === 0 ? (
            <p className="text-[#8A8A8A] text-sm">No data to display yet.</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {data.statusBreakdown.map(s => {
                const count = Number(s.count);
                const h = Math.max(4, (count / maxCount) * 100);
                return (
                  <div key={s.status} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full" style={{ height: `${h}%` }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-[#C9A86A]/20 group-hover:bg-[#C9A86A]/30 transition-colors" style={{ height: "100%" }} />
                      <div className="absolute bottom-0 left-0 right-0 bg-[#C9A86A]" style={{ height: "3px" }} />
                    </div>
                    <span className="text-[8px] text-[#333] group-hover:text-[#8A8A8A] transition-colors text-center leading-none">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {data.totalBookings === 0 && (
        <div className="mt-8 border border-[#1A1A1A] p-10 text-center">
          <p className="text-[#8A8A8A] text-sm">Analytics will populate as customers make bookings.</p>
          <p className="text-[#333] text-xs mt-2">Revenue metrics require the estimatedPrice field to be set on bookings.</p>
        </div>
      )}
    </div>
  );
}
