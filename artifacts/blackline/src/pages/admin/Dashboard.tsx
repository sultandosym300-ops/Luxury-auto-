import { motion } from "framer-motion";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";

const stats = [
  { label: "Bookings This Month", value: "34", icon: Calendar, change: "+12%" },
  { label: "Active Customers", value: "218", icon: Users, change: "+5%" },
  { label: "Revenue (MTD)", value: "$87,400", icon: DollarSign, change: "+18%" },
  { label: "Avg. Ticket", value: "$2,571", icon: TrendingUp, change: "+3%" },
];

const recentBookings = [
  { id: "BL-0091", customer: "David Kim", vehicle: "2023 Porsche GT3", service: "PPF", status: "In Progress", date: "May 31" },
  { id: "BL-0090", customer: "Marcus Torres", vehicle: "2024 Lamborghini Urus", service: "Ceramic", status: "Scheduled", date: "Jun 2" },
  { id: "BL-0089", customer: "Rachel Chen", vehicle: "2022 Ferrari Roma", service: "Paint Correction", status: "Completed", date: "May 29" },
  { id: "BL-0088", customer: "James Whitfield", vehicle: "2021 Rolls Royce Ghost", service: "Full Detail", status: "Completed", date: "May 28" },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-2">Admin</p>
        <h1 className="font-serif text-4xl text-foreground tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon size={16} className="text-muted-foreground" />
                <span className="text-primary text-xs">{stat.change}</span>
              </div>
              <div className="font-serif text-3xl text-foreground mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-xs tracking-wide">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl text-foreground">Recent Bookings</h2>
        </div>
        <div className="border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["ID", "Customer", "Vehicle", "Service", "Date", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs tracking-[0.2em] text-muted-foreground uppercase font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((row, i) => (
                <tr key={row.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}>
                  <td className="px-5 py-4 text-sm text-primary font-mono">{row.id}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{row.customer}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{row.vehicle}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{row.service}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{row.date}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs tracking-wider px-3 py-1 ${
                        row.status === "Completed"
                          ? "text-primary/80 border border-primary/20"
                          : row.status === "In Progress"
                          ? "text-foreground border border-border"
                          : "text-muted-foreground border border-border"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
