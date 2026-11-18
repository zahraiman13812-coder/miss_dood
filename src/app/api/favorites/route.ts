import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/session';
import { bad, errorResponse, noStore, sameOrigin } from '@/lib/http';
export const runtime='nodejs';
export async function GET(){try{const user=await currentUser();if(!user)return bad('AUTH_REQUIRED',401);
 const r=await db().query('SELECT product_slug FROM favorites WHERE user_id=$1 ORDER BY product_slug',[user.id]);
 return NextResponse.json({favorites:r.rows.map(x=>x.product_slug)},{headers:noStore});
}catch(e){return errorResponse(e);}}
export async function PUT(req:NextRequest){try{if(!sameOrigin(req))return bad('CROSS_ORIGIN',403);
 const user=await currentUser();if(!user)return bad('AUTH_REQUIRED',401);const data=await req.json();
 if(typeof data?.slug!=='string'||!/^[a-z0-9][a-z0-9-]{0,119}$/.test(data.slug)||typeof data?.saved!=='boolean')return bad('INVALID_FAVORITE');
 if(data.saved){const r=await db().query(`INSERT INTO favorites(user_id,product_slug) SELECT $1,slug FROM products WHERE slug=$2 AND active=true ON CONFLICT DO NOTHING RETURNING product_slug`,[user.id,data.slug]);
 if(!r.rowCount){const exists=await db().query('SELECT 1 FROM favorites WHERE user_id=$1 AND product_slug=$2',[user.id,data.slug]);if(!exists.rowCount)return bad('NOT_FOUND',404);}
 }else await db().query('DELETE FROM favorites WHERE user_id=$1 AND product_slug=$2',[user.id,data.slug]);
 return NextResponse.json({ok:true},{headers:noStore});
}catch(e){if(e instanceof SyntaxError)return bad('INVALID_JSON');return errorResponse(e);}}
