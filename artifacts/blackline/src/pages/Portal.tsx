import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Car, Calendar, Bell, ChevronRight, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { get } from "@/lib/api";
import type { Vehicle, BookingWithRels, Notification } from "@/lib/api";

const STATUS_LABELS: Record<string, string> = {
  quote_requested: "Quote Requested", scheduled: "Scheduled",
  vehicle_received: "Vehicle Received", preparation: "Preparation",
  in_progress: "In Progress", quality_inspection: "Quality Inspection",
  ready_for_pickup: "Ready for Pickup", completed: "Completed", cancelled: "Cancelled",
};

const CX = "max-w-[1100px] mx-auto px-6 md:px-10";

export default function Portal() {
  const { user, isLoading, isAuthenticated, login } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<BookingWithRels[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      get<Vehicle[]>("/portal/vehicles"),
      get<BookingWithRels[]>("/portal/bookings"),
      get<Notification[]>("/portal/notifications"),
    ]).then(([v, b, n]) => {
      setVehicles(v); setBookings(b); setNotifications(n);
    }).finally(() => setDataLoading(false));
  }, [isAuthenticated]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center">
      <div className="w-1 h-8 bg-[#C9A86A] animate-pulse" />
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-4">Customer Portal</p>
        <h1 className="font-serif text-4xl text-[#F5F5F5] mb-4 tracking-tight">My Account</h1>
        <p className="text-[#8A8A8A] text-sm leading-relaxed mb-8">
          Sign in to access your vehicle service records, track appointments, and manage your bookings.
        </p>
        <button onClick={login}
          className="bg-[#C9A86A] text-[#070707] px-10 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#b8974f] transition-colors">
          Sign In
        </button>
      </div>
    </div>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayName = user?.firstName ?? user?.email?.split("@")[0] ?? "Client";

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] pt-28 pb-40">
      <div className={CX}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-14 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[#C9A86A] text-[11px] tracking-[0.3em] uppercase mb-2">Customer Portal</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#F5F5F5] tracking-tight leading-none">
              Welcome, {displayName}.
            </h1>
          </div>
          {unreadCount > 0 && (
            <Link href="/portal/notifications" className="flex items-center gap-2 text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors">
              <Bell size={16} />
              <span className="text-[11px] tracking-wide">{unreadCount} new</span>
            </Link>
          )}
        </motion.div>

        {dataLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-1 h-6 bg-[#C9A86A] animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Garage */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Car size={16} className="text-[#C9A86A]" />
                  <h2 className="font-serif text-lg text-[#F5F5F5]">My Garage</h2>
                </div>
                <Link href="/portal/garage" className="text-[#C9A86A] text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors">
                  Manage
                </Link>
              </div>

              {vehicles.length === 0 ? (
                <div className="bg-[#111111] border border-[#1A1A1A] p-10 text-center mb-8">
                  <Car size={24} className="text-[#333] mx-auto mb-3" />
                  <p className="text-[#8A8A8A] text-sm mb-4">No vehicles added yet.</p>
                  <Link href="/portal/garage/add"
                    className="inline-flex items-center gap-2 text-[#C9A86A] text-[11px] tracking-[0.15em] uppercase hover:text-white transition-colors">
                    <Plus size={12} /> Add Vehicle
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  {vehicles.map(v => (
                    <Link key={v.id} href={`/portal/garage/${v.id}`}
                      className="block bg-[#111111] border border-[#1A1A1A] p-5 hover:border-[#C9A86A]/30 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#F5F5F5] text-sm font-medium">{v.year} {v.make} {v.model}</p>
                          {v.color && <p className="text-[#8A8A8A] text-xs mt-0.5">{v.color}{v.vin ? ` · ${v.vin}` : ""}</p>}
                        </div>
                        <ChevronRight size={14} className="text-[#333] group-hover:text-[#C9A86A] transition-colors" />
                      </div>
                    </Link>
                  ))}
                  <Link href="/portal/garage/add"
                    className="flex items-center gap-2 px-5 py-4 border border-dashed border-[#1A1A1A] text-[#8A8A8A] text-[11px] tracking-wide hover:border-[#C9A86A]/40 hover:text-[#C9A86A] transition-colors">
                    <Plus size={12} /> Add Another Vehicle
                  </Link>
                </div>
              )}

              {/* Recent bookings */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-[#C9A86A]" />
                  <h2 className="font-serif text-lg text-[#F5F5F5]">Appointments</h2>
                </div>
                <Link href="/booking" className="text-[#C9A86A] text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors">
                  Book New
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-[#111111] border border-[#1A1A1A] p-10 text-center">
                  <Calendar size={24} className="text-[#333] mx-auto mb-3" />
                  <p className="text-[#8A8A8A] text-sm mb-4">No appointments scheduled yet.</p>
                  <Link href="/booking"
                    className="inline-flex items-center gap-2 text-[#C9A86A] text-[11px] tracking-[0.15em] uppercase hover:text-white transition-colors">
                    Schedule a Service
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 4).map(({ booking, service }) => (
                    <Link key={booking.id} href={`/track/${booking.reference}`}
                      className="block bg-[#111111] border border-[#1A1A1A] p-5 hover:border-[#C9A86A]/30 transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-[#F5F5F5] text-sm font-medium mb-0.5">{service?.name ?? "Service TBD"}</p>
                          <p className="text-[#8A8A8A] text-xs">{booking.reference}
                            {booking.appointmentDate && ` · ${new Date(booking.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                          </p>
                        </div>
                        <span className="flex-shrink-0 text-[10px] tracking-wider uppercase text-[#C9A86A] bg-[#C9A86A]/10 px-2.5 py-1">
                          {STATUS_LABELS[booking.status] ?? booking.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications sidebar */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-[#C9A86A]" />
                  <h2 className="font-serif text-lg text-[#F5F5F5]">Notifications</h2>
                </div>
                {notifications.length > 0 && (
                  <Link href="/portal/notifications" className="text-[#C9A86A] text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors">
                    All
                  </Link>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="bg-[#111111] border border-[#1A1A1A] p-8 text-center">
                  <Bell size={20} className="text-[#333] mx-auto mb-3" />
                  <p className="text-[#8A8A8A] text-xs">No notifications yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 6).map(n => (
                    <div key={n.id} className={`bg-[#111111] border p-4 ${n.isRead ? "border-[#1A1A1A]" : "border-[#C9A86A]/20"}`}>
                      <p className={`text-xs font-medium mb-0.5 ${n.isRead ? "text-[#8A8A8A]" : "text-[#F5F5F5]"}`}>{n.title}</p>
                      <p className="text-[#8A8A8A] text-xs leading-relaxed">{n.message}</p>
                      <p className="text-[#333] text-[10px] mt-1.5">
                        {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
