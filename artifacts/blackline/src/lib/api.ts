const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export function get<T>(path: string) { return request<T>(path, { method: "GET" }); }
export function post<T>(path: string, body?: unknown) { return request<T>(path, { method: "POST", body: JSON.stringify(body) }); }
export function patch<T>(path: string, body?: unknown) { return request<T>(path, { method: "PATCH", body: JSON.stringify(body) }); }
export function put<T>(path: string, body?: unknown) { return request<T>(path, { method: "PUT", body: JSON.stringify(body) }); }
export function del<T>(path: string) { return request<T>(path, { method: "DELETE" }); }

// ─── types ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
}

export interface Service {
  id: number;
  name: string;
  description?: string | null;
  basePrice: string;
  duration?: string | null;
  benefits?: string[];
  isActive: boolean;
  displayOrder: number;
}

export interface Technician {
  id: number;
  name: string;
  specialty?: string | null;
  bio?: string | null;
  yearsExperience: number;
  initials?: string | null;
  isActive: boolean;
}

export type BookingStatus =
  | "quote_requested" | "scheduled" | "vehicle_received" | "preparation"
  | "in_progress" | "quality_inspection" | "ready_for_pickup" | "completed" | "cancelled";

export interface Booking {
  id: number;
  reference: string;
  userId?: string | null;
  serviceId?: number | null;
  technicianId?: number | null;
  appointmentDate?: string | null;
  timeSlot?: string | null;
  status: BookingStatus;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  vehicleDescription?: string | null;
  notes?: string | null;
  estimatedPrice?: string | null;
  createdAt: string;
}

export interface BookingWithRels {
  booking: Booking;
  service?: Service | null;
  technician?: Technician | null;
  timeline?: BookingTimeline[];
}

export interface BookingTimeline {
  id: number;
  bookingId: number;
  status: BookingStatus;
  note?: string | null;
  createdAt: string;
}

export interface Vehicle {
  id: number;
  userId: string;
  make: string;
  model: string;
  year: number;
  color?: string | null;
  vin?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  bookingId?: number | null;
  createdAt: string;
}

export interface PortfolioProject {
  id: number;
  vehicleName: string;
  vehicleYear?: number | null;
  services?: string[];
  imageUrl?: string | null;
  completionDate?: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface AnalyticsData {
  totalCustomers: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  revenueToday: number;
  revenueMonth: number;
  recentBookings: number;
  statusBreakdown: { status: BookingStatus; count: number }[];
}

export interface Customer {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt: string;
}
