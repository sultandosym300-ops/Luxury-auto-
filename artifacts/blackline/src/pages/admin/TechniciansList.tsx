const techs = [
  { name: "Marcus Rivera", specialty: "PPF & Ceramic Specialist", years: 9, certs: "XPEL Certified, 3M Certified", bookings: 124, rating: "4.98" },
  { name: "Jordan Hayes", specialty: "Paint Correction Expert", years: 7, certs: "IDA Certified Detailer", bookings: 98, rating: "4.97" },
  { name: "Alex Chen", specialty: "Full Detail & Interior", years: 5, certs: "IDA Member", bookings: 73, rating: "4.95" },
  { name: "Sarah Kim", specialty: "Window Film Specialist", years: 6, certs: "3M Certified Installer", bookings: 81, rating: "4.99" },
];

export default function TechniciansList() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-2">Admin</p>
        <h1 className="font-serif text-4xl text-foreground tracking-tight">Technicians</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techs.map((tech) => (
          <div key={tech.name} className="border border-border bg-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-xl text-foreground mb-1">{tech.name}</h3>
                <p className="text-primary/70 text-xs tracking-wide">{tech.specialty}</p>
              </div>
              <span className="text-muted-foreground text-xs">{tech.years} yrs exp</span>
            </div>
            <div className="border-t border-border pt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Certifications</p>
                <p className="text-xs text-foreground leading-relaxed">{tech.certs}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bookings</p>
                <p className="text-foreground text-lg font-serif">{tech.bookings}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Rating</p>
                <p className="text-primary text-lg font-serif">{tech.rating}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
