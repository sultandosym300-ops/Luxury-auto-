import { Router, type Request, type Response } from "express";
import { db, vehiclesTable, serviceHistoryTable, servicesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { insertVehicleSchema } from "@workspace/db/schema";

const router = Router();

router.get("/portal/vehicles", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const vehicles = await db.select().from(vehiclesTable)
    .where(eq(vehiclesTable.userId, req.user.id))
    .orderBy(desc(vehiclesTable.createdAt));
  res.json(vehicles);
});

router.get("/portal/vehicles/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = parseInt(req.params.id);
  const [vehicle] = await db.select().from(vehiclesTable)
    .where(eq(vehiclesTable.id, id));
  if (!vehicle || vehicle.userId !== req.user.id) { res.status(404).json({ error: "Not found" }); return; }
  const history = await db.select().from(serviceHistoryTable)
    .where(eq(serviceHistoryTable.vehicleId, id))
    .orderBy(desc(serviceHistoryTable.createdAt));
  res.json({ vehicle, history });
});

router.post("/portal/vehicles", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = insertVehicleSchema.safeParse({ ...req.body, userId: req.user.id });
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [vehicle] = await db.insert(vehiclesTable).values(parsed.data).returning();
  res.status(201).json(vehicle);
});

router.patch("/portal/vehicles/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = parseInt(req.params.id);
  const [existing] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id));
  if (!existing || existing.userId !== req.user.id) { res.status(404).json({ error: "Not found" }); return; }
  const { make, model, year, color, vin, notes } = req.body;
  const [updated] = await db.update(vehiclesTable)
    .set({ make, model, year, color, vin, notes })
    .where(eq(vehiclesTable.id, id))
    .returning();
  res.json(updated);
});

router.delete("/portal/vehicles/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = parseInt(req.params.id);
  const [existing] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id));
  if (!existing || existing.userId !== req.user.id) { res.status(404).json({ error: "Not found" }); return; }
  await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id));
  res.json({ success: true });
});

export default router;
