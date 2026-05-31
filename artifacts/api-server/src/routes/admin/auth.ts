import crypto from "crypto";
import { Router, type Request, type Response } from "express";
import { db, adminSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const ADMIN_CODE = process.env.ADMIN_CODE ?? "BLACKLINE2024";
const ADMIN_SESSION_COOKIE = "bl_admin_sid";
const ADMIN_SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

function setAdminCookie(res: Response, sid: string) {
  res.cookie(ADMIN_SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL,
  });
}

export async function isAdminRequest(req: Request): Promise<boolean> {
  const sid = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (!sid) return false;
  const [row] = await db
    .select()
    .from(adminSessionsTable)
    .where(eq(adminSessionsTable.sid, sid));
  if (!row || row.expiresAt < new Date()) {
    if (row) await db.delete(adminSessionsTable).where(eq(adminSessionsTable.sid, sid));
    return false;
  }
  return true;
}

router.post("/admin/auth/login", async (req: Request, res: Response) => {
  const { code } = req.body ?? {};
  if (code !== ADMIN_CODE) {
    res.status(401).json({ error: "Invalid access code" });
    return;
  }
  const sid = crypto.randomBytes(32).toString("hex");
  await db.insert(adminSessionsTable).values({
    sid,
    expiresAt: new Date(Date.now() + ADMIN_SESSION_TTL),
  });
  setAdminCookie(res, sid);
  res.json({ success: true });
});

router.post("/admin/auth/logout", async (req: Request, res: Response) => {
  const sid = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (sid) {
    await db.delete(adminSessionsTable).where(eq(adminSessionsTable.sid, sid));
  }
  res.clearCookie(ADMIN_SESSION_COOKIE, { path: "/" });
  res.json({ success: true });
});

router.get("/admin/auth/verify", async (req: Request, res: Response) => {
  const ok = await isAdminRequest(req);
  res.json({ authenticated: ok });
});

export default router;
