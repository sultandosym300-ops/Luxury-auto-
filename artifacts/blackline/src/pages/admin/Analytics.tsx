const monthly = [
  { month: "Jan", revenue: 62000 },
  { month: "Feb", revenue: 71000 },
  { month: "Mar", revenue: 85000 },
  { month: "Apr", revenue: 78000 },
  { month: "May", revenue: 87400 },
];

const serviceBreakdown = [
  { service: "PPF", share: 42, revenue: "$36,708" },
  { service: "Ceramic Coating", share: 24, revenue: "$20,976" },
  { service: "Paint Correction", share: 15, revenue: "$13,110" },
  { service: "Window Tint", share: 8, revenue: "$6,992" },
  { service: "Full Detail", share: 6, revenue: "$5,244" },
  { service: "Interior Restoration", share: 5, revenue: "$4,370" },
];

const maxRevenue = Math.max(...monthly.map((m) => m.revenue));

export default function Analytics() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-2">Admin</p>
        <h1 className="font-serif text-4xl text-foreground tracking-tight">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="border border-border bg-card p-6">
          <h2 className="font-serif text-xl text-foreground mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-4 h-40">
            {monthly.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 relative"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary"
                    style={{ height: "3px" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="border border-border bg-card p-6">
          <h2 className="font-serif text-xl text-foreground mb-6">Revenue by Service</h2>
          <div className="space-y-4">
            {serviceBreakdown.map((s) => (
              <div key={s.service}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground">{s.service}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{s.revenue}</span>
                    <span className="text-xs text-primary">{s.share}%</span>
                  </div>
                </div>
                <div className="h-[2px] bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-700"
                    style={{ width: `${s.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
