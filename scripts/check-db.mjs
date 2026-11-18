import pg from "pg";
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL is missing from .env.local"); process.exit(1); }
const client = new pg.Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000,ssl:process.env.DATABASE_SSL === "true" ? {rejectUnauthorized:true}:undefined});
try {
  await client.connect();
  const v=await client.query("SELECT current_database() AS database, current_user AS username, version() AS version");
  const t=await client.query("SELECT to_regclass('public.users') AS users, to_regclass('public.products') AS products, to_regclass('public.orders') AS orders");
  console.log(`Connected to ${v.rows[0].database} as ${v.rows[0].username}`);
  if (Object.values(t.rows[0]).some(x=>!x)) {console.error("Database connected but schema is missing. Execute db/001_init.sql in pgAdmin Query Tool.");process.exitCode=2;}
  else console.log("Database schema OK (users, products, orders).");
} catch(e) {console.error("PostgreSQL connection failed:",e.message);process.exitCode=1;}
finally {await client.end().catch(()=>{});}
