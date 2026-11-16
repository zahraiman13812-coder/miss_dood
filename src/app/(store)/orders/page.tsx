"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readPreviews, type PreviewOrder } from "@/features/preview/orders";
import { productPrice } from "@/data/mock/latestProducts";

export default function OrdersPage() {
  const [orders,setOrders] = useState<PreviewOrder[] | null>(null);
  const [query,setQuery] = useState("");
  const matching = orders?.filter(o => o.id.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => setOrders(readPreviews()), []);
  return <main className="mx-auto w-full max-w-3xl space-y-5 px-5 py-12">
    <h1 className="text-2xl font-bold">پیگیری سفارش</h1>
    <p className="text-muted">نمونه‌های ساخته‌شده در همین تب مرورگر</p>
    <label className="block">شناسهٔ پیش‌نمایش<input dir="ltr" type="search" value={query} onChange={e=>setQuery(e.target.value)} className="mt-2 block w-full rounded-xl border border-line bg-panel px-4 py-3"/></label>
    {query && orders?.length && !matching?.length ? <p>سفارشی با این شناسه پیدا نشد.</p> : null}
    {matching?.map(order => <article key={order.id} className="space-y-3 rounded-2xl border border-line bg-panel p-5">
      <h2 className="font-bold text-accent">{new Date(order.date).toLocaleString("fa-IR")}</h2>
      <p className="text-sm text-muted">شناسه: <bdi className="break-all">{order.id}</bdi></p>
      <ul>{order.items.map((i,n) => <li key={n} className="flex flex-wrap justify-between gap-2 py-2"><span>{i.name} × {i.quantity.toLocaleString("fa-IR")}</span><span>{productPrice(i.amount)}</span></li>)}</ul>
      <p className="border-t border-line pt-3">جمع کالاها · {productPrice(order.total)}</p>
    </article>)}
    {orders?.length === 0 && <p>هنوز پیش‌نمایشی نساخته‌ای.</p>}
    <Link className="inline-block text-accent" href="/shop">بازگشت به فروشگاه</Link>
  </main>;
}
