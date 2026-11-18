import type { Product } from "@/data/mock/latestProducts";
import type { PreviewOrder } from "@/features/preview/orders";

export type CatalogItem = Product & {brand: string; specs: [string,string][]; edited?: boolean};
export type ShippingRule = {city:string; fee:number; days:string};
import type { Ticket } from "@/features/support/tickets";
export type Store = {
  products:CatalogItem[]; stock:Record<string,number>; shipping:ShippingRule[];
  city:string; orders:PreviewOrder[]; tickets:Ticket[];
};
const key = "miss-dood.store.v2";
const event = "miss-dood-store-change";
export const initial:Store = {
  products:[], stock:{}, shipping:[], city:"", orders:[], tickets:[]
};
let cachedRaw:string | null = null;
let cached:Store = initial;
function legacy<T>(key:string, empty:T):T {
  try { return JSON.parse(sessionStorage.getItem(key) || "null") ?? empty; } catch { return empty; }
}
let migrated = false;
export function readStore():Store {
  if (typeof sessionStorage === "undefined") return initial;
  let raw;
  try { raw=sessionStorage.getItem(key); } catch { return initial; }
  if (raw === cachedRaw && (raw !== null || migrated)) return cached;
  if (raw === null) {
    cached={...initial,orders:legacy("miss-dood.preview-orders.v1",[])};
    migrated=true;
  } else {
    try { const saved=JSON.parse(raw) as Partial<Store>;
      cached={...initial,city:typeof saved.city==='string'?saved.city:'',orders:Array.isArray(saved.orders)?saved.orders:[],tickets:Array.isArray(saved.tickets)?saved.tickets:[]}; } catch { cached=initial; }
  }
  cachedRaw=raw;
  return cached;
}
export function updateStore(change:(current:Store)=>Store) {
  const next=change(readStore());
  const raw=JSON.stringify({city:next.city});
  try { sessionStorage.setItem(key,raw); } catch { /* Private browsing may block storage. */ }
  cachedRaw=raw; cached=next;
  window.dispatchEvent(new Event(event));
}
export function subscribeStore(refresh:()=>void) {
  window.addEventListener(event,refresh);
  return ()=>window.removeEventListener(event,refresh);
}
