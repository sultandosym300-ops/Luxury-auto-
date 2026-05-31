const customers = [
  { id: "C-001", name: "David Kim", email: "d.kim@email.com", vehicle: "2023 Porsche GT3", visits: 4, spent: "$14,200" },
  { id: "C-002", name: "Marcus Torres", email: "m.torres@email.com", vehicle: "2024 Lamborghini Urus", visits: 2, spent: "$5,800" },
  { id: "C-003", name: "Rachel Chen", email: "r.chen@email.com", vehicle: "2022 Ferrari Roma", visits: 3, spent: "$8,400" },
  { id: "C-004", name: "James Whitfield", email: "j.whitfield@email.com", vehicle: "2021 Rolls Royce Ghost", visits: 6, spent: "$22,100" },
  { id: "C-005", name: "Priya Mehta", email: "p.mehta@email.com", vehicle: "2024 McLaren Artura", visits: 1, spent: "$350" },
];

export default function CustomersList() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-2">Admin</p>
        <h1 className="font-serif text-4xl text-foreground tracking-tight">Customers</h1>
      </div>
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Name", "Email", "Primary Vehicle", "Visits", "Total Spent"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs tracking-[0.2em] text-muted-foreground uppercase font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((row, i) => (
              <tr key={row.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}>
                <td className="px-5 py-4 text-sm text-muted-foreground font-mono">{row.id}</td>
                <td className="px-5 py-4 text-sm text-foreground font-medium">{row.name}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{row.email}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{row.vehicle}</td>
                <td className="px-5 py-4 text-sm text-foreground">{row.visits}</td>
                <td className="px-5 py-4 text-sm text-primary">{row.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
