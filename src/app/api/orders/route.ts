import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { db, transaction } from "@/lib/db";
import { bad, errorResponse, noStore, sameOrigin } from "@/lib/http";
export const runtime="nodejs";
class OrderError extends Error {constructor(public code:string){super(code);}}
export async function GET() {try {
 const user=await currentUser(); if(!user)return bad("AUTH_REQUIRED",401);
 const result=await db().query(`SELECT o.id,o.status,o.created_at AS date,o.subtotal::float8 AS subtotal,o.total::float8 AS total,
 json_build_object('city',o.shipping_city,'fee',o.shipping_fee::float8,'days','') AS shipping,
 COALESCE((SELECT json_agg(json_build_object('name',i.product_name,'quantity',i.quantity,'amount',i.amount::float8)) FROM order_items i WHERE i.order_id=o.id),'[]'::json) AS items
 FROM orders o WHERE o.user_id=$1 ORDER BY o.created_at DESC LIMIT 100`,[user.id]);
 return NextResponse.json({orders:result.rows},{headers:noStore});
} catch(e){return errorResponse(e);} }
export async function POST(req:NextRequest) {try {
 if(!sameOrigin(req))return bad("CROSS_ORIGIN",403);
 const user=await currentUser();if(!user)return bad("AUTH_REQUIRED",401);
 const key=req.headers.get("idempotency-key");
 if(!key || !/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(key))return bad("INVALID_REQUEST_ID");
 const data=await req.json();
 if(!data || typeof data!=="object" || Array.isArray(data))return bad("INVALID_BODY");
 const name=typeof data.recipientName==="string"?data.recipientName.trim():"", phone=typeof data.recipientPhone==="string"?data.recipientPhone.trim():"", address=typeof data.shippingAddress==="string"?data.shippingAddress.trim():"", city=typeof data.shippingCity==="string"?data.shippingCity.trim():"";
 const note=typeof data.note==="string"?data.note.trim():"";
 if(!name||name.length>120||!/^\+?[0-9۰-۹٠-٩ \-]{8,22}$/.test(phone)||address.length<6||address.length>1000||!city||city.length>120||note.length>1000) return bad("INVALID_RECIPIENT");
 if(!Array.isArray(data.items)||data.items.length<1||data.items.length>50) return bad("INVALID_ITEMS");
 const unique=new Set<string>();
 const items:{slug:string;quantity:number}[]=[];
 for(const item of data.items){if(!item||typeof item.slug!=="string"||!/^[a-z0-9][a-z0-9-]{0,119}$/.test(item.slug)||!Number.isSafeInteger(item.quantity)||item.quantity<1||item.quantity>99||unique.has(item.slug))return bad("INVALID_ITEMS");unique.add(item.slug);items.push({slug:item.slug,quantity:item.quantity});}
 // Fast path for retries after the original request has already committed.
 const existing=await db().query<{id:string}>("SELECT id FROM orders WHERE user_id=$1 AND idempotency_key=$2",[user.id,key]);
 if(existing.rows[0])return NextResponse.json({orderId:existing.rows[0].id},{status:200,headers:noStore});
 const orderId=await transaction(async client=>{
  const shipping=await client.query<{fee:string}>("SELECT fee::text FROM shipping_rules WHERE city=$1 AND active=true",[city]);
  if(!shipping.rows[0])throw new OrderError("INVALID_SHIPPING_CITY");
  const rows=await client.query<{slug:string;name:string;price_toman:string;stock:number}>("SELECT slug,name,price_toman::text,stock FROM products WHERE slug = ANY($1::text[]) AND active=true ORDER BY slug FOR UPDATE",[items.map(i=>i.slug)]);
  // Locks on the same products serialize simultaneous retries of the same checkout.
  const previous=await client.query<{id:string}>("SELECT id FROM orders WHERE user_id=$1 AND idempotency_key=$2",[user.id,key]);
  if(previous.rows[0])return previous.rows[0].id;
  if(rows.rows.length!==items.length)throw new OrderError("PRODUCT_UNAVAILABLE");
  let subtotal=0;const lines=[];
  for(const item of items){const product=rows.rows.find(p=>p.slug===item.slug)!;
   if(product.price_toman===null)throw new OrderError("PRICE_UNAVAILABLE");
   if(product.stock<item.quantity)throw new OrderError("INSUFFICIENT_STOCK");
   const price=Number(product.price_toman),amount=price*item.quantity;
   if(!Number.isSafeInteger(amount)||!Number.isSafeInteger(subtotal+amount))throw new OrderError("AMOUNT_OVERFLOW");
   subtotal+=amount;lines.push({...item,name:product.name,price,amount});
  }
  const fee=Number(shipping.rows[0].fee);if(!Number.isSafeInteger(subtotal+fee))throw new OrderError("AMOUNT_OVERFLOW");
  const result=await client.query<{id:string}>(`INSERT INTO orders(user_id,recipient_name,recipient_phone,shipping_address,shipping_city,subtotal,shipping_fee,total,note,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,[user.id,name,phone,address,city,subtotal,fee,subtotal+fee,note||null,key]);
  for(const line of lines){
   await client.query("UPDATE products SET stock=stock-$1,updated_at=now() WHERE slug=$2",[line.quantity,line.slug]);
   await client.query("INSERT INTO order_items(order_id,product_slug,product_name,unit_price,quantity,amount) VALUES($1,$2,$3,$4,$5,$6)",[result.rows[0].id,line.slug,line.name,line.price,line.quantity,line.amount]);
  }
  return result.rows[0].id;
 });
 return NextResponse.json({orderId},{status:201,headers:noStore});
} catch(e){if(e instanceof OrderError)return bad(e.code,409);if(e instanceof SyntaxError)return bad("INVALID_JSON");return errorResponse(e);} }
