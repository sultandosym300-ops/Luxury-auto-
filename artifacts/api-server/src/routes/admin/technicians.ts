import { Router, type Request, type Response } from "express";
import { db, techniciansTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/adminMiddleware";

const router = Router();
router.use(requireAdmin);

router.get("/admin/technicians", async (_req, res: Response) => {
  const techs = await db.select().from(techniciansTable).orderBy(asc(techniciansTable.id));
  res.json(techs);
});

router.post("/admin/technicians", async (req: Request, res: Response) => {
  const { name, specialty, bio, yearsExperience, initials, isActive } = req.body;
  if (!name) { res.status(400).json({ error: "name required" }); return; }
  const [tech] = await db.insert(techniciansTable).values({
    name, specialty, bio, yearsExperience: yearsExperience ?? 1,
    initials: initials ?? name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
    isActive: isActive ?? true,
  }).returning();
  res.status(201).json(tech);
});

router.patch("/admin/technicians/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, specialty, bio, yearsExperience, initials, isActive } = req.body;
  const [tech] = await db.update(techniciansTable)
    .set({ name, specialty, bio, yearsExperience, initials, isActive })
    .where(eq(techniciansTable.id, id))
    .returning();
  if (!tech) { res.status(404).json({ error: "Not found" }); return; }
  res.json(tech);
});

router.delete("/admin/technicians/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await db.delete(techniciansTable).where(eq(techniciansTable.id, id));
  res.json({ success: true });
});

export default router;
