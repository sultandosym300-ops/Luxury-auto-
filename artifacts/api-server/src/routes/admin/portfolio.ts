import { Router, type Request, type Response } from "express";
import { db, portfolioProjectsTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/adminMiddleware";

const router = Router();
router.use(requireAdmin);

router.get("/admin/portfolio", async (_req, res: Response) => {
  const projects = await db.select().from(portfolioProjectsTable)
    .orderBy(asc(portfolioProjectsTable.displayOrder), desc(portfolioProjectsTable.createdAt));
  res.json(projects);
});

router.post("/admin/portfolio", async (req: Request, res: Response) => {
  const { vehicleName, vehicleYear, services, imageUrl, completionDate, isPublished, displayOrder } = req.body;
  if (!vehicleName) { res.status(400).json({ error: "vehicleName required" }); return; }
  const [project] = await db.insert(portfolioProjectsTable).values({
    vehicleName, vehicleYear: vehicleYear ?? null, services: services ?? [],
    imageUrl: imageUrl ?? null, completionDate: completionDate ?? null,
    isPublished: isPublished ?? true, displayOrder: displayOrder ?? 0,
  }).returning();
  res.status(201).json(project);
});

router.patch("/admin/portfolio/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { vehicleName, vehicleYear, services, imageUrl, completionDate, isPublished, displayOrder } = req.body;
  const [project] = await db.update(portfolioProjectsTable)
    .set({ vehicleName, vehicleYear, services, imageUrl, completionDate, isPublished, displayOrder })
    .where(eq(portfolioProjectsTable.id, id))
    .returning();
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json(project);
});

router.delete("/admin/portfolio/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await db.delete(portfolioProjectsTable).where(eq(portfolioProjectsTable.id, id));
  res.json({ success: true });
});

export default router;
