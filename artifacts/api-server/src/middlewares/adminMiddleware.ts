import { type Request, type Response, type NextFunction } from "express";
import { isAdminRequest } from "../routes/admin/auth";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const ok = await isAdminRequest(req);
  if (!ok) {
    res.status(401).json({ error: "Admin authentication required" });
    return;
  }
  next();
}
