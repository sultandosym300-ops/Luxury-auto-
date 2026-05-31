import { Router, type Request, type Response } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/adminMiddleware";

const router = Router();
router.use(requireAdmin);

router.get("/admin/settings", async (_req, res: Response) => {
  const settings = await db.select().from(settingsTable);
  const obj: Record<string, string | null> = {};
  for (const s of settings) obj[s.key] = s.value;
  res.json(obj);
});

router.put("/admin/settings/:key", async (req: Request, res: Response) => {
  const { key } = req.params;
  const { value } = req.body;
  const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
  if (existing.length > 0) {
    await db.update(settingsTable).set({ value }).where(eq(settingsTable.key, key));
  } else {
    await db.insert(settingsTable).values({ key, value });
  }
  res.json({ key, value });
});

router.put("/admin/settings", async (req: Request, res: Response) => {
  const updates: Record<string, string> = req.body;
  for (const [key, value] of Object.entries(updates)) {
    const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
    if (existing.length > 0) {
      await db.update(settingsTable).set({ value }).where(eq(settingsTable.key, key));
    } else {
      await db.insert(settingsTable).values({ key, value });
    }
  }
  res.json({ success: true });
});

export default router;
