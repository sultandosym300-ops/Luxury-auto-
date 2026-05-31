const bookings = [
  { id: "BL-0091", customer: "David Kim", vehicle: "2023 Porsche GT3", service: "PPF", tech: "Marcus Rivera", date: "May 31", status: "In Progress" },
  { id: "BL-0090", customer: "Marcus Torres", vehicle: "2024 Lamborghini Urus", service: "Ceramic", tech: "Marcus Rivera", date: "Jun 2", status: "Scheduled" },
  { id: "BL-0089", customer: "Rachel Chen", vehicle: "2022 Ferrari Roma", service: "Paint Correction", tech: "Jordan Hayes", date: "May 29", status: "Completed" },
  { id: "BL-0088", customer: "James Whitfield", vehicle: "2021 Rolls Royce Ghost", service: "Full Detail", tech: "Alex Chen", date: "May 28", status: "Completed" },
  { id: "BL-0087", customer: "Priya Mehta", vehicle: "2024 McLaren Artura", service: "Window Tint", tech: "Sarah Kim", date: "May 27", status: "Completed" },
];

export default function BookingsList() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-2">Admin</p>
        <h1 className="font-serif text-4xl text-foreground tracking-tight">Bookings</h1>
      </div>
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Customer", "Vehicle", "Service", "Technician", "Date", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs tracking-[0.2em] text-muted-foreground uppercase font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((row, i) => (
              <tr key={row.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}>
                <td className="px-5 py-4 text-sm text-primary font-mono">{row.id}</td>
                <td className="px-5 py-4 text-sm text-foreground">{row.customer}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{row.vehicle}</td>
                <td className="px-5 py-4 text-sm text-foreground">{row.service}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{row.tech}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{row.date}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs tracking-wider px-3 py-1 border ${row.status === "Completed" ? "text-primary/80 border-primary/20" : "text-muted-foreground border-border"}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
