import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wrench,
  UserCog,
  BarChart2,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/technicians", label: "Technicians", icon: UserCog },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
];

function isAuthed() {
  return sessionStorage.getItem("bl_admin") === "1";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthed()) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  if (!isAuthed()) return null;

  const handleLogout = () => {
    sessionStorage.removeItem("bl_admin");
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#070707] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-[#1A1A1A] flex flex-col">
        <div className="px-6 py-5 border-b border-[#1A1A1A]">
          <p className="font-serif text-base tracking-[0.2em] text-[#C9A86A] uppercase">BLACKLINE</p>
          <p className="text-[#8A8A8A] text-[9px] tracking-[0.2em] uppercase mt-1">Studio Management</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? location === href : location.startsWith(href) && href !== "/admin";
            const isExactAdmin = href === "/admin" && location === "/admin";
            const isActive = isExactAdmin || (!exact && location.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide transition-colors duration-150 ${
                  isActive
                    ? "text-[#C9A86A] bg-[#111111]"
                    : "text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#0d0d0d]"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#1A1A1A] space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-[12px] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            data-testid="button-admin-logout"
            className="flex items-center gap-3 px-3 py-2.5 text-[12px] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors w-full text-left"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto bg-[#070707]">
        <div className="max-w-[1060px] mx-auto px-8 md:px-12 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
