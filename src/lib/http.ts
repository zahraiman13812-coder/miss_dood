import { NextResponse } from "next/server";
export function bad(error: string, status=400) { return NextResponse.json({error},{status,headers:{"Cache-Control":"no-store"}}); }
export const noStore = {"Cache-Control":"no-store"};
export function errorResponse(error: unknown) { console.error("API failure",error); return bad("SERVER_ERROR",503); }
/** Reject cross-origin browser writes; empty Origin is accepted for CLI clients. */
export function sameOrigin(request: Request) {
 const origin = request.headers.get("origin");
 if (!origin) return true;
 try { return new URL(origin).host.toLowerCase() === request.headers.get("host")?.toLowerCase(); }
 catch { return false; }
}
