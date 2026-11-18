import { NextRequest, NextResponse } from "next/server";
import { db, transaction } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { bad, errorResponse, noStore, sameOrigin } from "@/lib/http";
export const runtime="nodejs";
async function admin() {return (await currentUser())?.role === "admin";}
export async function GET(){try{if(!await admin())return bad("FORBIDDEN",403);
 const [orders,products,shipping]=await Promise.all([
 db().query(`SELECT id,status,created_at AS date,recipient_name,recipient_phone,shipping_address,shipping_city,total::float8,subtotal::float8 FROM orders ORDER BY created_at DESC LIMIT 200`),
 db().query(`SELECT slug,name,category,price_toman::float8 AS "priceToman",stock,active FROM products ORDER BY name`),
 db().query("SELECT city,fee::float8 AS fee,days,active FROM shipping_rules ORDER BY city")]);
 return NextResponse.json({orders:orders.rows,products:products.rows,shipping:shipping.rows},{headers:noStore});
}catch(e){return errorResponse(e);}}
export async function PATCH(req:NextRequest){try {if(!sameOrigin(req))return bad("CROSS_ORIGIN",403);if(!await admin())return bad("FORBIDDEN",403);
 const body=await req.json();
 if(body.type==="stock") {if(typeof body.slug!=="string"||!Number.isSafeInteger(body.stock)||body.stock<0||body.stock>1000000)return bad("INVALID_STOCK");
  const r=await db().query("UPDATE products SET stock=$1,updated_at=now() WHERE slug=$2 RETURNING slug",[body.stock,body.slug]);if(!r.rowCount)return bad("NOT_FOUND",404);
 }else if(body.type==="status"){
  if(!["received","processing","shipped","delivered","cancelled"].includes(body.status)||typeof body.id!=="string")return bad("INVALID_STATUS");
  await transaction(async client=>{
   const old=await client.query<{status:string}>("SELECT status FROM orders WHERE id=$1 FOR UPDATE",[body.id]);if(!old.rows[0])throw new Error("NOT_FOUND");
   if(old.rows[0].status==="cancelled" && body.status!=="cancelled")throw new Error("CANCELLED_FINAL");
   const transitions:Record<string,string[]>={received:["processing","cancelled"],processing:["shipped","cancelled"],shipped:["delivered","cancelled"],delivered:[],cancelled:[]};
   if(body.status!==old.rows[0].status && !transitions[old.rows[0].status]?.includes(body.status))throw new Error("INVALID_TRANSITION");
   if(body.status==="cancelled" && old.rows[0].status!=="cancelled") {
    if(old.rows[0].status==="delivered")throw new Error("DELIVERED_FINAL");
    await client.query("UPDATE products p SET stock=p.stock+i.quantity FROM order_items i WHERE i.order_id=$1 AND p.slug=i.product_slug",[body.id]);
   }
   await client.query("UPDATE orders SET status=$1 WHERE id=$2",[body.status,body.id]);
  });
 }else if(body.type==="shipping"){
  if(typeof body.city!=="string"||body.city.trim().length<2||body.city.length>120||!Number.isSafeInteger(body.fee)||body.fee<0||body.fee>100000000||typeof body.days!=="string"||body.days.length>120)return bad("INVALID_SHIPPING");
  await db().query("INSERT INTO shipping_rules(city,fee,days) VALUES($1,$2,$3) ON CONFLICT(city) DO UPDATE SET fee=$2,days=$3,active=true",[body.city.trim(),body.fee,body.days]);
 }else if(body.type==="product"){
  if(typeof body.slug!=="string"||!/^[a-z0-9][a-z0-9-]{0,119}$/.test(body.slug)||typeof body.name!=="string"||!body.name.trim()||body.name.length>200||typeof body.category!=="string"||body.category.length>80||!(body.priceToman===null||(Number.isSafeInteger(body.priceToman)&&body.priceToman>=0))||!Number.isSafeInteger(body.stock)||body.stock<0||body.stock>1000000)return bad("INVALID_PRODUCT");
  await db().query(`INSERT INTO products(slug,name,category,description,image,price_toman,stock) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(slug) DO UPDATE SET name=$2,category=$3,description=$4,image=$5,price_toman=$6,stock=$7,updated_at=now()`,[body.slug,body.name.trim(),body.category,typeof body.description==="string"?body.description.slice(0,3000):"",typeof body.image==="string"&&body.image.startsWith("/images/")?body.image:"/images/categories/lighters.webp",body.priceToman,body.stock]);
 }else return bad("INVALID_TYPE");
 return NextResponse.json({ok:true},{headers:noStore});
}catch(e){if(e instanceof SyntaxError)return bad("INVALID_JSON");if(e instanceof Error&&["NOT_FOUND","CANCELLED_FINAL","DELIVERED_FINAL","INVALID_TRANSITION"].includes(e.message))return bad(e.message,409);return errorResponse(e);}}
