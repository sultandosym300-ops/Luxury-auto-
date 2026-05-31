import { Router, type Request, type Response } from "express";
import { db, bookingsTable, usersTable, servicesTable } from "@workspace/db";
import { eq, gte, count, sum, sql } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/adminMiddleware";

const router = Router();
router.use(requireAdmin);

router.get("/admin/analytics", async (_req, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalCustomers] = await db.select({ count: count() }).from(usersTable);
  const [totalBookings] = await db.select({ count: count() }).from(bookingsTable);

  const [activeBookings] = await db.select({ count: count() }).from(bookingsTable)
    .where(sql`status NOT IN ('completed', 'cancelled')`);

  const [completedBookings] = await db.select({ count: count() }).from(bookingsTable)
    .where(eq(bookingsTable.status, "completed"));

  // Revenue from completed bookings this month
  const [monthRevenue] = await db.select({
    total: sum(bookingsTable.estimatedPrice)
  }).from(bookingsTable).where(
    sql`status = 'completed' AND created_at >= ${monthStart.toISOString()}`
  );

  // Revenue from completed bookings today
  const [todayRevenue] = await db.select({
    total: sum(bookingsTable.estimatedPrice)
  }).from(bookingsTable).where(
    sql`status = 'completed' AND created_at >= ${today.toISOString()}`
  );

  // Bookings by status
  const statusBreakdown = await db.select({
    status: bookingsTable.status,
    count: count(),
  }).from(bookingsTable).groupBy(bookingsTable.status);

  // Recent bookings (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [recentBookings] = await db.select({ count: count() }).from(bookingsTable)
    .where(gte(bookingsTable.createdAt, sevenDaysAgo));

  res.json({
    totalCustomers: totalCustomers.count,
    totalBookings: totalBookings.count,
    activeBookings: activeBookings.count,
    completedBookings: completedBookings.count,
    revenueToday: parseFloat(todayRevenue?.total ?? "0") || 0,
    revenueMonth: parseFloat(monthRevenue?.total ?? "0") || 0,
    recentBookings: recentBookings.count,
    statusBreakdown,
  });
});

export default router;
