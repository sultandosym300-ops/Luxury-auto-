import { Router, type Request, type Response } from "express";
import { db, usersTable, bookingsTable, vehiclesTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/adminMiddleware";

const router = Router();
router.use(requireAdmin);

router.get("/admin/customers", async (_req, res: Response) => {
  const customers = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      profileImageUrl: usersTable.profileImageUrl,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));
  res.json(customers);
});

router.get("/admin/customers/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  const bookings = await db.select().from(bookingsTable)
    .where(eq(bookingsTable.userId, id))
    .orderBy(desc(bookingsTable.createdAt));
  const vehicles = await db.select().from(vehiclesTable)
    .where(eq(vehiclesTable.userId, id));
  res.json({ user, bookings, vehicles });
});

export default router;
