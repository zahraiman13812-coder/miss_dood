import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser, hashPassword, issueSession, removeSession, verifyPassword } from "@/lib/session";
import { bad, errorResponse, noStore, sameOrigin } from "@/lib/http";
import { consumeAuthAttempt } from "@/lib/authRateLimit";
export const runtime="nodejs";
export async function GET() { try { return NextResponse.json({user:await currentUser()},{headers:noStore}); } catch(e){return errorResponse(e);} }
export async function DELETE(req: NextRequest) { try {if(!sameOrigin(req))return bad("CROSS_ORIGIN",403);await removeSession();return NextResponse.json({ok:true},{headers:noStore});}catch(e){return errorResponse(e);} }
export async function POST(req:NextRequest) {
 try {
  if(!sameOrigin(req))return bad("CROSS_ORIGIN",403);
  const body = await req.json();
  if(!body || typeof body!=="object" || Array.isArray(body))return bad("INVALID_BODY");
  const email = typeof body.email==="string"?body.email.trim().toLowerCase():"";
  const password = body.password;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || typeof password!=="string" || password.length<10 || password.length>128) return bad("INVALID_CREDENTIALS");
  if (body.action !== "register" && body.action !== "login") return bad("INVALID_ACTION");
  // The forwarded IP is set by the trusted reverse proxy; the email bucket limits abuse even without it.
  const remote = req.headers.get("x-real-ip") ?? "unknown";
  if (!(await consumeAuthAttempt(email,remote))) return bad("TOO_MANY_ATTEMPTS",429);
  if(body.action === "register") {
   const name = typeof body.name==="string"?body.name.trim():"";
   if(!name || name.length>120) return bad("INVALID_NAME");
   const result=await db().query<{id:string}>("INSERT INTO users(email,password_hash,full_name) VALUES($1,$2,$3) ON CONFLICT(email) DO NOTHING RETURNING id",[email,hashPassword(password),name]);
   if(!result.rows[0]) return bad("ACCOUNT_EXISTS",409);
   await issueSession(result.rows[0].id);
  } else if(body.action === "login") {
   const result=await db().query<{id:string;password_hash:string}>("SELECT id,password_hash FROM users WHERE email=$1",[email]);
   if(!result.rows[0] || !verifyPassword(password,result.rows[0].password_hash)) return bad("INVALID_CREDENTIALS",401);
   await issueSession(result.rows[0].id);
  } else return bad("INVALID_ACTION");
  return NextResponse.json({user:await currentUser()},{headers:noStore});
 } catch(e) { if(e instanceof SyntaxError) return bad("INVALID_JSON");return errorResponse(e); }
}
