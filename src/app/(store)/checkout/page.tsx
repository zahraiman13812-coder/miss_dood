"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PurchaseSteps from "@/features/cart/PurchaseSteps";
import { useStore } from "@/features/store/useStore";
import { ShippingAmount } from "@/features/store/Shipping";
import { useCart, changeQuantity } from "@/features/cart/useCart";
import { summarizeCart } from "@/features/cart/cartSummary";
import { productPrice } from "@/data/mock/latestProducts";
const field="mt-2 w-full rounded-xl border border-line bg-header px-4 py-3 text-content";
export default function CheckoutPage(){
 const cart=useCart(), {shipping,city,catalogStatus}=useStore(), rule=shipping.find(s=>s.city===city);
 const {lines,count,total,stockIssue}=summarizeCart(cart);
 const requestId=useRef<string | null>(null);
 const lock=useRef(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[receipt,setReceipt]=useState(""),[review,setReview]=useState(false);
 const [recipient,setRecipient]=useState({name:"",phone:"",address:""});
 // Preserve the key for network retries but replace it whenever checkout contents change.
 const signature=JSON.stringify({recipient,city,items:lines.map(l=>[l.product.slug,l.quantity])});
 const previousSignature=useRef(signature);
 useEffect(()=>{if(previousSignature.current!==signature){previousSignature.current=signature;requestId.current=null;}},[signature]);
 async function submitOrder(){if(lock.current||!count||!rule||stockIssue)return;lock.current=true;setBusy(true);setError("");
  try{requestId.current ??= crypto.randomUUID();const response=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":requestId.current},body:JSON.stringify({recipientName:recipient.name,recipientPhone:recipient.phone,shippingAddress:recipient.address,shippingCity:city,items:lines.map(l=>({slug:l.product.slug,quantity:l.quantity}))})});
   const data=await response.json();if(!response.ok) {if(response.status===401)throw Error("برای ثبت سفارش ابتدا وارد حساب شوید.");throw Error(({INSUFFICIENT_STOCK:"موجودی بعضی کالاها کافی نیست.",INVALID_SHIPPING_CITY:"شهر تحویل فعال نیست.",PRODUCT_UNAVAILABLE:"بعضی کالاها دیگر قابل سفارش نیستند."} as Record<string,string>)[data.error]||"ثبت سفارش ناموفق بود؛ دوباره تلاش کنید.");}
   setReceipt(data.orderId);for(const [slug,qty] of Object.entries(cart))changeQuantity(slug,-qty);
  }catch(e){setError(e instanceof Error?e.message:"اتصال به سرور برقرار نشد.");}finally{lock.current=false;setBusy(false);}
 }
 if(receipt)return <main className="mx-auto w-full max-w-xl space-y-4 px-5 py-12"><PurchaseSteps current={3}/><h1 className="text-2xl font-bold text-accent">سفارش شما ثبت شد</h1><p>شماره سفارش: <bdi>{receipt}</bdi></p><p>پرداخت آنلاین فعلاً فعال نیست. برای هماهنگی پرداخت با فروشگاه تماس بگیرید.</p><Link href="/orders" className="text-accent">پیگیری سفارش</Link></main>;
 return <main className="mx-auto w-full max-w-2xl space-y-5 px-4 py-8"><Link href="/cart" className="text-sm text-accent">بازگشت به سبد خرید</Link><PurchaseSteps current={review?2:1}/><h1 className="text-2xl font-bold">{review?"مرور سفارش":"مشخصات گیرنده"}</h1>
 {catalogStatus !== "ready" ? <p role="status">{catalogStatus === "loading" ? "در حال دریافت اطلاعات فروشگاه…" : "ارتباط با فروشگاه برقرار نشد. لطفاً بعداً دوباره تلاش کنید."}</p> : !count||stockIssue||!rule||total===null?<p>سبد خرید یا شهر ارسال را بررسی کنید. <Link href="/cart" className="text-accent">بازگشت</Link></p>:
 review?<section className="space-y-4 rounded-2xl border border-line bg-panel p-4 sm:p-6"><b>{recipient.name}</b><p>{recipient.phone}</p><p>{recipient.address}</p><ul className="divide-y divide-line">{lines.map(l=><li className="flex flex-wrap justify-between gap-3 py-2" key={l.product.slug}><span>{l.product.name} × {l.quantity}</span><span>{productPrice(l.amount)}</span></li>)}</ul><ShippingAmount rule={rule} subtotal={total}/><p>پرداخت اینترنتی غیرفعال است؛ سفارش با وضعیت «دریافت شده» ثبت می‌شود.</p><p role="alert" className="text-red-500">{error}</p><button disabled={busy} onClick={submitOrder} className="w-full rounded-xl bg-accent py-3 font-bold text-on-accent">{busy?"در حال ثبت...":"ثبت قطعی سفارش"}</button><button type="button" onClick={()=>setReview(false)} className="rounded-xl border border-line px-4 py-3">ویرایش مشخصات</button></section>:
 <form className="space-y-4 rounded-2xl border border-line bg-panel p-4 sm:p-6" onSubmit={e=>{e.preventDefault();setReview(true);}}><ShippingAmount rule={rule} subtotal={total}/><label className="block">نام گیرنده<input required maxLength={120} autoComplete="name" className={field} value={recipient.name} onChange={e=>setRecipient({...recipient,name:e.target.value})}/></label><label className="block">شماره تماس<input required dir="ltr" type="tel" inputMode="tel" autoComplete="tel" pattern="[+0-9۰-۹٠-٩ \-]{8,22}" maxLength={22} className={field} value={recipient.phone} onChange={e=>setRecipient({...recipient,phone:e.target.value})}/></label><label className="block">آدرس<textarea required minLength={6} maxLength={1000} autoComplete="street-address" rows={3} className={field} value={recipient.address} onChange={e=>setRecipient({...recipient,address:e.target.value})}/></label><Link className="text-sm text-accent" href="/login">اگر حساب ندارید، پیش از نهایی کردن سفارش ثبت‌نام کنید.</Link><button className="w-full rounded-xl bg-accent py-3 font-bold text-on-accent">مرور سفارش</button></form>}
 </main>;
}
