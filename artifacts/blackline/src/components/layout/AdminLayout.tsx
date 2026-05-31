import { Link, useLocation } from "wouter";
import { LayoutDashboard, Calendar, Users, Briefcase, Wrench, BarChart } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Calendar, label: "Bookings", path: "/admin/bookings" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: Briefcase, label: "Services", path: "/admin/services" },
    { icon: Wrench, label: "Technicians", path: "/admin/technicians" },
    { icon: BarChart, label: "Analytics", path: "/admin/analytics" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-serif text-xl tracking-widest text-primary">BLACKLINE</Link>
          <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">Admin Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            &larr; Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
