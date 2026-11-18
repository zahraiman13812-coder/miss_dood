"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {statuses} from "@/features/preview/orders";
import {productPrice} from "@/data/mock/latestProducts";
type Order={id:string;status:keyof typeof statuses;date:string;total:number;items:{name:string;quantity:number;amount:number}[]};
export default function OrdersPage(){const[orders,setOrders]=useState<Order[]>([]),[message,setMessage]=useState("در حال دریافت سفارش‌ها..."),[query,setQuery]=useState("");
 useEffect(()=>{fetch("/api/orders",{cache:"no-store"}).then(async r=>{if(r.status===401)throw Error("برای مشاهده سفارش‌ها وارد حساب شوید.");if(!r.ok)throw Error("دریافت سفارش‌ها ناموفق بود.");return r.json();}).then(d=>{setOrders(d.orders);setMessage("");}).catch(e=>setMessage(e.message));},[]);
 return <main className="mx-auto max-w-3xl space-y-5 p-6"><h1 className="text-2xl font-bold">سفارش‌های من</h1><label className="block">جست‌وجو با شناسه سفارش<input className="mt-2 w-full rounded-xl border border-line bg-panel p-3" dir="ltr" value={query} onChange={e=>setQuery(e.target.value)}/></label><p role="status">{message}</p>{orders.filter(o=>o.id.includes(query)).map(o=><article key={o.id} className="space-y-3 rounded-2xl border border-line bg-panel p-5"><p className="text-accent">{statuses[o.status]??o.status}</p><p className="text-sm">{new Date(o.date).toLocaleString("fa-IR")}</p><p className="break-all text-xs">{o.id}</p><ul>{o.items.map((i,n)=><li className="flex justify-between gap-3" key={n}>{i.name} × {i.quantity}<span>{productPrice(i.amount)}</span></li>)}</ul><b>{productPrice(o.total)}</b></article>)}{!message&&!orders.length&&<p>هنوز سفارشی ندارید.</p>}<Link href="/shop" className="text-accent">بازگشت به فروشگاه</Link></main>;
}
