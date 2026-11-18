// Run locally: ADMIN_EMAIL=you@example.com npm run admin:promote
import pg from "pg";
const email=process.env.ADMIN_EMAIL?.trim().toLowerCase();
if(!email)throw Error("Set ADMIN_EMAIL");
const db=new pg.Client({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL === "true" ? {rejectUnauthorized:true}:undefined});await db.connect();try{
 const r=await db.query("UPDATE users SET role='admin' WHERE email=$1 RETURNING id",[email]);
 if(r.rowCount!==1)throw Error("User not found: register on website first");console.log("Admin promoted successfully");
}finally{await db.end();}
