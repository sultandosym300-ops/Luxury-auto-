const serviceList = [
  { name: "Paint Protection Film (PPF)", category: "Protection", basePrice: "$2,500", duration: "3-5 days", active: true },
  { name: "Ceramic Coating", category: "Protection", basePrice: "$1,200", duration: "1-2 days", active: true },
  { name: "Paint Correction", category: "Restoration", basePrice: "$800", duration: "1-3 days", active: true },
  { name: "Window Tint", category: "Enhancement", basePrice: "$350", duration: "4-6 hours", active: true },
  { name: "Full Detail", category: "Maintenance", basePrice: "$450", duration: "6-8 hours", active: true },
  { name: "Interior Restoration", category: "Restoration", basePrice: "$600", duration: "1 day", active: true },
];

export default function ServicesList() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-2">Admin</p>
        <h1 className="font-serif text-4xl text-foreground tracking-tight">Services</h1>
      </div>
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Service", "Category", "Starting Price", "Duration", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs tracking-[0.2em] text-muted-foreground uppercase font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {serviceList.map((row, i) => (
              <tr key={row.name} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}>
                <td className="px-5 py-4 text-sm text-foreground font-medium">{row.name}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{row.category}</td>
                <td className="px-5 py-4 text-sm text-primary">{row.basePrice}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{row.duration}</td>
                <td className="px-5 py-4">
                  <span className="text-xs tracking-wider px-3 py-1 border border-primary/20 text-primary/80">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
