import { Router, type Request, type Response } from "express";
import { db, techniciansTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/technicians", async (_req: Request, res: Response) => {
  const techs = await db
    .select()
    .from(techniciansTable)
    .where(eq(techniciansTable.isActive, true))
    .orderBy(asc(techniciansTable.id));
  res.json(techs);
});

export default router;
