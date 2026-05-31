import { Router, type Request, type Response } from "express";
import { db, bookingsTable, bookingTimelineTable, servicesTable, techniciansTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

router.get("/portal/bookings", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const bookings = await db
    .select({
      booking: bookingsTable,
      service: servicesTable,
      technician: techniciansTable,
    })
    .from(bookingsTable)
    .leftJoin(servicesTable, eq(bookingsTable.serviceId, servicesTable.id))
    .leftJoin(techniciansTable, eq(bookingsTable.technicianId, techniciansTable.id))
    .where(eq(bookingsTable.userId, req.user.id))
    .orderBy(desc(bookingsTable.createdAt));
  res.json(bookings);
});

router.get("/portal/bookings/:id/timeline", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = parseInt(req.params.id);
  const [booking] = await db.select().from(bookingsTable).where(
    and(eq(bookingsTable.id, id), eq(bookingsTable.userId, req.user.id))
  );
  if (!booking) { res.status(404).json({ error: "Not found" }); return; }
  const timeline = await db.select().from(bookingTimelineTable)
    .where(eq(bookingTimelineTable.bookingId, id))
    .orderBy(bookingTimelineTable.createdAt);
  res.json(timeline);
});

export default router;
