import { Router, type Request, type Response } from "express";
import { db, bookingsTable, bookingTimelineTable, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function genReference(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BL-${year}-${num}`;
}

router.post("/bookings", async (req: Request, res: Response) => {
  const {
    serviceId, technicianId, appointmentDate, timeSlot,
    contactName, contactEmail, contactPhone, vehicleDescription, notes,
  } = req.body ?? {};

  if (!contactName || !contactEmail || !contactPhone) {
    res.status(400).json({ error: "contactName, contactEmail, and contactPhone are required" });
    return;
  }

  let reference = genReference();
  // ensure uniqueness (rare collision guard)
  let attempts = 0;
  while (attempts < 5) {
    const [existing] = await db.select().from(bookingsTable).where(eq(bookingsTable.reference, reference));
    if (!existing) break;
    reference = genReference();
    attempts++;
  }

  const userId = req.isAuthenticated() ? req.user?.id : undefined;

  const [booking] = await db.insert(bookingsTable).values({
    reference,
    userId: userId ?? null,
    serviceId: serviceId ? parseInt(serviceId) : null,
    technicianId: technicianId ? parseInt(technicianId) : null,
    appointmentDate: appointmentDate ?? null,
    timeSlot: timeSlot ?? null,
    contactName,
    contactEmail,
    contactPhone,
    vehicleDescription: vehicleDescription ?? null,
    notes: notes ?? null,
    status: "scheduled",
  }).returning();

  // Create timeline entry
  await db.insert(bookingTimelineTable).values({
    bookingId: booking.id,
    status: "scheduled",
    note: "Booking confirmed",
  });

  // Create notification if user is authenticated
  if (userId) {
    await db.insert(notificationsTable).values({
      userId,
      title: "Booking Confirmed",
      message: `Your appointment (${reference}) has been confirmed.`,
      type: "booking_confirmed",
      bookingId: booking.id,
    });
  }

  res.status(201).json(booking);
});

router.get("/bookings/track/:reference", async (req: Request, res: Response) => {
  const { reference } = req.params;
  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.reference, reference));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const timeline = await db
    .select()
    .from(bookingTimelineTable)
    .where(eq(bookingTimelineTable.bookingId, booking.id))
    .orderBy(bookingTimelineTable.createdAt);

  res.json({ booking, timeline });
});

export default router;
