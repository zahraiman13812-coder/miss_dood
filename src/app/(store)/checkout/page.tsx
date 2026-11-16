"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { savePreview } from "@/features/preview/orders";
import { changeQuantity, useCart } from "@/features/cart/useCart";
import { summarizeCart } from "@/features/cart/cartSummary";
import { productPrice } from "@/data/mock/latestProducts";

const field = "mt-2 w-full rounded-xl border border-line bg-header px-4 py-3 text-content";
export default function CheckoutPage() {
  const cart = useCart();
  const { lines, count, total } = summarizeCart(cart);
  const lock = useRef(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [receipt,setReceipt] = useState("");
  const [review, setReview] = useState(false);
  const [recipient, setRecipient] = useState({ name: "", phone: "", address: "" });
  function submitOrder() {
    if (lock.current || !count || total === null) return;
    lock.current = true;
    setBusy(true); setError("");
    try {
      const id = crypto.randomUUID();
      savePreview({ id, date:new Date().toISOString(), total,
        items:lines.map(line => ({name:line.product.name, quantity:line.quantity, amount:line.amount!})) });
      setReceipt(id);
      for (const [slug,quantity] of Object.entries(cart)) changeQuantity(slug,-quantity);
    } catch { setError("ذخیرهٔ پیش‌نمایش در این مرورگر ممکن نیست."); }
    finally { lock.current = false; setBusy(false); }
  }
  if (receipt) return <main className="mx-auto w-full max-w-xl space-y-4 px-5 py-12">
    <h1 className="text-2xl font-bold text-accent">پیش‌نمایش سفارش آماده شد</h1>
    <p>شناسهٔ پیش‌نمایش: <bdi className="break-all">{receipt}</bdi></p>
    <Link href="/orders" className="inline-block rounded-xl border border-line px-4 py-3">مشاهده پیش‌نمایش‌ها</Link>
  </main>;
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/cart" className="text-sm text-accent">بازگشت به سبد خرید</Link>
      <h1 className="my-5 text-2xl font-bold">{review ? "مرور سفارش" : "مشخصات گیرنده"}</h1>
      {!count || total === null ? <p>برای ادامه، سبد خرید را بررسی کنید.</p> :
        review ? <section className="space-y-4 rounded-2xl border border-line bg-panel p-6">
          <h2 className="font-bold">{recipient.name}</h2>
          <p><bdi>{recipient.phone}</bdi></p><p className="whitespace-pre-line">{recipient.address}</p>
          <ul className="divide-y divide-line border-y border-line">{lines.map(({product, quantity, amount}) =>
            <li key={product.slug} className="flex flex-wrap justify-between gap-2 py-3"><span>{product.name} × {quantity.toLocaleString("fa-IR")}</span><span>{productPrice(amount)}</span></li>)}</ul>
          <p className="font-bold text-accent">جمع کالاها · {productPrice(total)}</p>
          <p className="text-sm text-muted">این سفارش نمایشی است. فقط فهرست کالاها و مبلغ در همین تب ذخیره می‌شود.</p>
          <p role="status" className="text-sm">{error}</p>
          <button disabled={busy} onClick={submitOrder} className="w-full rounded-xl bg-accent py-3 font-bold text-on-accent">{busy ? "در حال ثبت…" : "تکمیل پیش‌نمایش"}</button>
          <button type="button" disabled={busy} onClick={() => setReview(false)} className="rounded-xl border border-line px-4 py-3">ویرایش مشخصات</button>
        </section> : <form className="space-y-4 rounded-2xl border border-line bg-panel p-6" onSubmit={e => { e.preventDefault(); setReview(true); }}>
          <label className="block">نام و نام خانوادگی<input className={field} autoComplete="name" required value={recipient.name} onChange={e => setRecipient({...recipient, name:e.target.value})}/></label>
          <label className="block">شماره تماس<input className={field} type="tel" pattern="[+0-9۰-۹٠-٩ ]{8,18}" dir="ltr" autoComplete="tel" required value={recipient.phone} onChange={e => setRecipient({...recipient, phone:e.target.value})}/></label>
          <label className="block">آدرس تحویل<textarea className={field} autoComplete="street-address" minLength={6} required rows={3} value={recipient.address} onChange={e => setRecipient({...recipient, address:e.target.value})}/></label>
          <button className="w-full rounded-xl bg-accent py-3 font-bold text-on-accent">مرور سفارش</button>
        </form>}
    </main>
  );
}
