import { Router, type Request, type Response } from "express";
import { db, bookingsTable, bookingTimelineTable, servicesTable, techniciansTable, notificationsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/adminMiddleware";

const router = Router();
router.use(requireAdmin);

router.get("/admin/bookings", async (_req: Request, res: Response) => {
  const bookings = await db
    .select({
      booking: bookingsTable,
      service: servicesTable,
      technician: techniciansTable,
    })
    .from(bookingsTable)
    .leftJoin(servicesTable, eq(bookingsTable.serviceId, servicesTable.id))
    .leftJoin(techniciansTable, eq(bookingsTable.technicianId, techniciansTable.id))
    .orderBy(desc(bookingsTable.createdAt));
  res.json(bookings);
});

router.get("/admin/bookings/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const [row] = await db.select({
    booking: bookingsTable,
    service: servicesTable,
    technician: techniciansTable,
  })
    .from(bookingsTable)
    .leftJoin(servicesTable, eq(bookingsTable.serviceId, servicesTable.id))
    .leftJoin(techniciansTable, eq(bookingsTable.technicianId, techniciansTable.id))
    .where(eq(bookingsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  const timeline = await db.select().from(bookingTimelineTable)
    .where(eq(bookingTimelineTable.bookingId, id))
    .orderBy(bookingTimelineTable.createdAt);
  res.json({ ...row, timeline });
});

router.patch("/admin/bookings/:id/status", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { status, note } = req.body;
  const [booking] = await db.update(bookingsTable)
    .set({ status })
    .where(eq(bookingsTable.id, id))
    .returning();
  if (!booking) { res.status(404).json({ error: "Not found" }); return; }

  await db.insert(bookingTimelineTable).values({ bookingId: id, status, note: note ?? null });

  // Send notification if user exists
  if (booking.userId) {
    const messages: Record<string, string> = {
      vehicle_received: "Your vehicle has been received at our studio.",
      in_progress: "Your service is now in progress.",
      quality_inspection: "Your vehicle is undergoing final quality inspection.",
      ready_for_pickup: "Your vehicle is ready for pickup!",
      completed: "Your service has been completed. Thank you!",
    };
    if (messages[status]) {
      await db.insert(notificationsTable).values({
        userId: booking.userId,
        title: "Status Update",
        message: messages[status],
        type: status,
        bookingId: id,
      });
    }
  }

  res.json(booking);
});

router.patch("/admin/bookings/:id/assign", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { technicianId } = req.body;
  const [booking] = await db.update(bookingsTable)
    .set({ technicianId: technicianId ? parseInt(technicianId) : null })
    .where(eq(bookingsTable.id, id))
    .returning();
  if (!booking) { res.status(404).json({ error: "Not found" }); return; }
  res.json(booking);
});

router.patch("/admin/bookings/:id/reschedule", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { appointmentDate, timeSlot } = req.body;
  const [booking] = await db.update(bookingsTable)
    .set({ appointmentDate, timeSlot })
    .where(eq(bookingsTable.id, id))
    .returning();
  if (!booking) { res.status(404).json({ error: "Not found" }); return; }
  res.json(booking);
});

router.delete("/admin/bookings/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await db.delete(bookingsTable).where(eq(bookingsTable.id, id));
  res.json({ success: true });
});

export default router;
