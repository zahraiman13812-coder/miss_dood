import "server-only";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";
export const cookieName = "miss_dood_session";
const days = 14;
export type CurrentUser = { id: string; email: string; full_name: string; role: "customer" | "admin" };
function digest(raw: string) { return createHash("sha256").update(raw).digest("hex"); }
export function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return salt + ":" + scryptSync(password, salt, 64).toString("hex"); }
export function verifyPassword(password: string, saved: string) {
  const [salt, hash] = saved.split(":");
  if (!salt || !hash || !/^[a-f0-9]{128}$/.test(hash)) return false;
  const a = Buffer.from(hash, "hex"), b = scryptSync(password, salt, a.length);
  return timingSafeEqual(a,b);
}
export async function issueSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  await db().query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '14 days')", [digest(token),userId]);
  (await cookies()).set(cookieName, token, { httpOnly:true, secure: process.env.NODE_ENV === "production", sameSite:"lax", path:"/", maxAge: days*86400 });
}
export async function currentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const {rows} = await db().query<CurrentUser>(`SELECT u.id,u.email,u.full_name,u.role FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>now()`,[digest(token)]);
  return rows[0] ?? null;
}
export async function removeSession() {
  const token=(await cookies()).get(cookieName)?.value;
  if (token) await db().query("DELETE FROM sessions WHERE token_hash=$1",[digest(token)]);
  (await cookies()).delete(cookieName);
}
