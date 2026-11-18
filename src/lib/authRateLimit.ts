import "server-only";
import { createHash } from "node:crypto";
import { db } from "./db";
/** Fixed 15-minute window: 10 attempts, then 15-minute cooldown. */
export async function consumeAuthAttempt(email: string, remote: string): Promise<boolean> {
  const bucket = createHash("sha256").update(`${email}|${remote}`).digest("hex");
  const result = await db().query<{allowed:boolean}>(`
    INSERT INTO auth_rate_limits(bucket,attempts,window_start,blocked_until)
    VALUES ($1,1,now(),NULL)
    ON CONFLICT(bucket) DO UPDATE SET
      attempts = CASE WHEN auth_rate_limits.window_start < now()-interval '15 minutes' THEN 1 ELSE auth_rate_limits.attempts+1 END,
      window_start = CASE WHEN auth_rate_limits.window_start < now()-interval '15 minutes' THEN now() ELSE auth_rate_limits.window_start END,
      blocked_until = CASE
        WHEN auth_rate_limits.window_start < now()-interval '15 minutes' THEN NULL
        WHEN auth_rate_limits.blocked_until > now() THEN auth_rate_limits.blocked_until
        WHEN auth_rate_limits.attempts+1 > 10 THEN now()+interval '15 minutes'
        ELSE NULL END
    RETURNING (attempts<=10 AND (blocked_until IS NULL OR blocked_until<=now())) AS allowed`,[bucket]);
  return result.rows[0]?.allowed === true;
}
