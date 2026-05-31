import { Router, type Request, type Response } from "express";
import { db, portfolioProjectsTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";

const router = Router();

router.get("/portfolio", async (_req: Request, res: Response) => {
  const projects = await db
    .select()
    .from(portfolioProjectsTable)
    .where(eq(portfolioProjectsTable.isPublished, true))
    .orderBy(asc(portfolioProjectsTable.displayOrder), desc(portfolioProjectsTable.createdAt));
  res.json(projects);
});

export default router;
