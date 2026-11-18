import { NextRequest, NextResponse } from "next/server";
import { db, transaction } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { bad, errorResponse, noStore, sameOrigin } from "@/lib/http";
export const runtime = "nodejs";
const validId = (v:unknown) => typeof v === "string" && /^[a-f0-9-]{36}$/i.test(v);
export async function GET() {
 try {
  const user = await currentUser(); if(!user)return bad("AUTH_REQUIRED",401);
  const result = await db().query(`SELECT t.id,t.subject,t.status,t.created_at,
   COALESCE((SELECT json_agg(json_build_object('from',CASE WHEN u.role='admin' THEN 'admin' ELSE 'customer' END,'text',m.body,'date',m.created_at) ORDER BY m.created_at,m.id)
   FROM support_messages m JOIN users u ON u.id=m.sender_id WHERE m.ticket_id=t.id),'[]'::json) AS messages
   FROM support_tickets t WHERE ($1::boolean OR t.user_id=$2::uuid) ORDER BY t.created_at DESC LIMIT 100`,[user.role==='admin',user.id]);
  return NextResponse.json({tickets:result.rows},{headers:noStore});
 } catch(e){return errorResponse(e);}
}
export async function POST(req:NextRequest) {
 try {
  if(!sameOrigin(req))return bad('CROSS_ORIGIN',403);
  const user=await currentUser();if(!user)return bad('AUTH_REQUIRED',401);
  const data=await req.json();if(!data || typeof data!=='object')return bad('INVALID_BODY');
  const body=data.message;
  if(typeof body!=='string'||body.trim().length<2||body.length>2000)return bad('INVALID_MESSAGE');
  if(data.action==='create'){
   if(user.role==='admin')return bad('CUSTOMER_ONLY',403);
   if(typeof data.subject!=='string'||!data.subject.trim()||data.subject.length>100)return bad('INVALID_SUBJECT');
   const id=await transaction(async c=>{
    const t=await c.query<{id:string}>("INSERT INTO support_tickets(user_id,subject) VALUES($1,$2) RETURNING id",[user.id,data.subject.trim()]);
    await c.query("INSERT INTO support_messages(ticket_id,sender_id,body) VALUES($1,$2,$3)",[t.rows[0].id,user.id,body.trim()]);return t.rows[0].id;
   });return NextResponse.json({id},{status:201,headers:noStore});
  }
  if(data.action==='reply' && validId(data.id)){
   const result=await transaction(async c=>{
    const t=await c.query<{status:string}>("SELECT status FROM support_tickets WHERE id=$1 AND ($2::boolean OR user_id=$3::uuid) FOR UPDATE",[data.id,user.role==='admin',user.id]);
    if(!t.rows[0])return 'NOT_FOUND';if(t.rows[0].status==='closed')return 'CLOSED';
    await c.query("INSERT INTO support_messages(ticket_id,sender_id,body) VALUES($1,$2,$3)",[data.id,user.id,body.trim()]);
    if(user.role==='admin')await c.query("UPDATE support_tickets SET status='answered' WHERE id=$1",[data.id]);
    else await c.query("UPDATE support_tickets SET status='open' WHERE id=$1",[data.id]);
    return 'OK';
   });if(result!=='OK')return bad(result,result==='NOT_FOUND'?404:409);
   return NextResponse.json({ok:true},{headers:noStore});
  }
  return bad('INVALID_ACTION');
 }catch(e){if(e instanceof SyntaxError)return bad('INVALID_JSON');return errorResponse(e);}
}
export async function PATCH(req:NextRequest){
 try{if(!sameOrigin(req))return bad('CROSS_ORIGIN',403);const user=await currentUser();if(user?.role!=='admin')return bad('FORBIDDEN',403);
  const data=await req.json();if(!validId(data?.id)||!['open','closed'].includes(data?.status))return bad('INVALID_STATUS');
  const r=await db().query('UPDATE support_tickets SET status=$1 WHERE id=$2 RETURNING id',[data.status,data.id]);
  if(!r.rowCount)return bad('NOT_FOUND',404);return NextResponse.json({ok:true},{headers:noStore});
 }catch(e){if(e instanceof SyntaxError)return bad('INVALID_JSON');return errorResponse(e);}
}
