import { Router, type Request, type Response } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/adminMiddleware";

const router = Router();
router.use(requireAdmin);

router.get("/admin/services", async (_req, res: Response) => {
  const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.displayOrder), asc(servicesTable.id));
  res.json(services);
});

router.post("/admin/services", async (req: Request, res: Response) => {
  const { name, description, basePrice, duration, benefits, isActive, displayOrder } = req.body;
  if (!name || !basePrice) { res.status(400).json({ error: "name and basePrice required" }); return; }
  const [service] = await db.insert(servicesTable).values({
    name, description, basePrice, duration, benefits: benefits ?? [],
    isActive: isActive ?? true, displayOrder: displayOrder ?? 0,
  }).returning();
  res.status(201).json(service);
});

router.patch("/admin/services/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, description, basePrice, duration, benefits, isActive, displayOrder } = req.body;
  const [service] = await db.update(servicesTable)
    .set({ name, description, basePrice, duration, benefits, isActive, displayOrder })
    .where(eq(servicesTable.id, id))
    .returning();
  if (!service) { res.status(404).json({ error: "Not found" }); return; }
  res.json(service);
});

router.delete("/admin/services/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  res.json({ success: true });
});

export default router;
