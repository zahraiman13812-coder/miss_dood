"use client";
import { useState } from "react";
import { productPrice } from "@/data/mock/latestProducts";
import { updateStore, type ShippingRule } from "./store";
import { useStore } from "./useStore";

export function ShippingAmount({rule,subtotal}:{rule:ShippingRule;subtotal:number}) {
  return <dl className="my-4 space-y-2 border-y border-line py-3 text-sm">
    <div className="flex justify-between gap-2"><dt>ارسال به {rule.city}</dt><dd>{rule.fee ? productPrice(rule.fee) : "رایگان"}</dd></div>
    <div className="flex justify-between gap-2"><dt>زمان تقریبی تحویل</dt><dd>{rule.days}</dd></div>
    <div className="flex flex-wrap justify-between gap-2 font-bold text-accent"><dt>جمع با ارسال</dt><dd>{productPrice(subtotal+rule.fee)}</dd></div>
  </dl>;
}
export function ShippingPicker({subtotal}:{subtotal:number}) {
  const {shipping,city}=useStore();
  const [error,setError]=useState("");
  const rule=shipping.find(r=>r.city===city);
  return <section className="my-4 text-sm">
    <label className="block font-bold">شهر تحویل<select className="my-2 block w-full rounded-xl border border-line bg-panel p-3" value={rule?.city || ""} onChange={e=>{
      try {updateStore(s=>({...s,city:e.target.value}));setError("");} catch {setError("ذخیرهٔ شهر ممکن نیست.");}
    }}><option value="">انتخاب شهر</option>{shipping.map(r=><option key={r.city}>{r.city}</option>)}</select></label>
    <p className="text-xs leading-6 text-muted">{shipping.length ? "ارسال فقط به شهرهای این فهرست فعال است." : "مقصد و تعرفهٔ ارسال هنوز از سوی فروشگاه اعلام نشده است."}</p>
    {rule && <ShippingAmount subtotal={subtotal} rule={rule}/>}<p role="status">{error}</p>
  </section>;
}
