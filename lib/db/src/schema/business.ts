import { pgTable, serial, varchar, text, integer, boolean, timestamp, numeric, pgEnum, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const bookingStatusEnum = pgEnum("booking_status", [
  "quote_requested",
  "scheduled",
  "vehicle_received",
  "preparation",
  "in_progress",
  "quality_inspection",
  "ready_for_pickup",
  "completed",
  "cancelled",
]);

// ─── Services ─────────────────────────────────────────────────────────────────

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;

// ─── Technicians ──────────────────────────────────────────────────────────────

export const techniciansTable = pgTable("technicians", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }),
  bio: text("bio"),
  yearsExperience: integer("years_experience").notNull().default(1),
  initials: varchar("initials", { length: 5 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTechnicianSchema = createInsertSchema(techniciansTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTechnician = z.infer<typeof insertTechnicianSchema>;
export type Technician = typeof techniciansTable.$inferSelect;

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  color: varchar("color", { length: 100 }),
  vin: varchar("vin", { length: 17 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehiclesTable.$inferSelect;

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 20 }).notNull().unique(),
  userId: varchar("user_id").references(() => usersTable.id, { onDelete: "set null" }),
  vehicleId: integer("vehicle_id").references(() => vehiclesTable.id, { onDelete: "set null" }),
  serviceId: integer("service_id").references(() => servicesTable.id, { onDelete: "set null" }),
  technicianId: integer("technician_id").references(() => techniciansTable.id, { onDelete: "set null" }),
  appointmentDate: date("appointment_date"),
  timeSlot: varchar("time_slot", { length: 20 }),
  status: bookingStatusEnum("status").notNull().default("scheduled"),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }).notNull(),
  vehicleDescription: varchar("vehicle_description", { length: 500 }),
  notes: text("notes"),
  estimatedPrice: numeric("estimated_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;

// ─── Booking Timeline ─────────────────────────────────────────────────────────

export const bookingTimelineTable = pgTable("booking_timeline", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookingsTable.id, { onDelete: "cascade" }),
  status: bookingStatusEnum("status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BookingTimeline = typeof bookingTimelineTable.$inferSelect;

// ─── Service History ──────────────────────────────────────────────────────────

export const serviceHistoryTable = pgTable("service_history", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehiclesTable.id, { onDelete: "cascade" }),
  bookingId: integer("booking_id").references(() => bookingsTable.id, { onDelete: "set null" }),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  technicianName: varchar("technician_name", { length: 255 }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ServiceHistory = typeof serviceHistoryTable.$inferSelect;

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  isRead: boolean("is_read").notNull().default(false),
  bookingId: integer("booking_id").references(() => bookingsTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Notification = typeof notificationsTable.$inferSelect;

// ─── Portfolio ────────────────────────────────────────────────────────────────

export const portfolioProjectsTable = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  vehicleName: varchar("vehicle_name", { length: 255 }).notNull(),
  vehicleYear: integer("vehicle_year"),
  services: jsonb("services").$type<string[]>().default([]),
  imageUrl: text("image_url"),
  completionDate: date("completion_date"),
  isPublished: boolean("is_published").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPortfolioSchema = createInsertSchema(portfolioProjectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type PortfolioProject = typeof portfolioProjectsTable.$inferSelect;

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Setting = typeof settingsTable.$inferSelect;

// ─── Admin Sessions ───────────────────────────────────────────────────────────

export const adminSessionsTable = pgTable("admin_sessions", {
  sid: varchar("sid", { length: 64 }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type AdminSession = typeof adminSessionsTable.$inferSelect;
