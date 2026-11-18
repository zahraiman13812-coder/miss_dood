import pg from "pg";
const db = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === "true" ? {rejectUnauthorized:true}:undefined });
await db.connect();
try { const r = await db.query("DELETE FROM sessions WHERE expires_at <= now()"); console.log("expired sessions removed:", r.rowCount); }
finally { await db.end(); }
