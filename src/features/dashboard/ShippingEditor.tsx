"use client";
import { useState, type FormEvent } from "react";
import { productPrice } from "@/data/mock/latestProducts";
import { useStore } from "@/features/store/useStore";
import { updateStore } from "@/features/store/store";
import { card, input, primary } from "./Panel";

export default function ShippingEditor() {
  const {shipping}=useStore();
  const [editing,setEditing]=useState("");
  const [message,setMessage]=useState("");
  const rule=shipping.find(r=>r.city===editing);
  function save(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget, data=new FormData(form);
    const city=String(data.get("city")).trim(), days=String(data.get("days")).trim(), fee=Number(data.get("fee"));
    if (!city || !days || !Number.isSafeInteger(fee) || fee<0) {setMessage("شهر، هزینه و زمان تحویل را بررسی کنید.");return;}
    if (city!==editing && shipping.some(r=>r.city===city)) {setMessage("این مقصد قبلاً ثبت شده است.");return;}
    try {
      updateStore(s=>({...s,shipping:[...s.shipping.filter(r=>r.city!==editing),{city,fee,days}],city:editing && s.city===editing ? city : s.city}));
      setEditing("");form.reset();setMessage("تعرفه ذخیره شد.");
    } catch {setMessage("ذخیرهٔ تعرفه انجام نشد.");}
  }
  function remove(city:string) {
    try {updateStore(s=>({...s,shipping:s.shipping.filter(r=>r.city!==city),city:s.city===city ? "" : s.city}));
      if (editing===city) setEditing("");setMessage("شهر از محدودهٔ ارسال حذف شد.");
    } catch {setMessage("حذف تعرفه انجام نشد.");}
  }
  return <section className={card}><h3 className="font-bold">مقصدها و تعرفه‌های ارسال</h3>
    <ul className="divide-y divide-line">{shipping.map(r=><li className="flex flex-wrap items-center justify-between gap-3 py-4" key={r.city}>
      <div><strong>{r.city}</strong><p className="mt-1 text-sm text-muted">{productPrice(r.fee)} · {r.days}</p></div>
      <div className="flex gap-4 text-sm text-accent"><button onClick={()=>setEditing(r.city)}>ویرایش</button><button onClick={()=>remove(r.city)}>حذف</button></div></li>)}</ul>
    <form key={editing} onSubmit={save} className="mt-4 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
      <label>شهر مقصد<input required className={input} name="city" defaultValue={rule?.city}/></label>
      <label>هزینهٔ ارسال (تومان)<input required type="number" min="0" step="1" className={input} name="fee" defaultValue={rule?.fee}/></label>
      <label className="sm:col-span-2">زمان تقریبی تحویل<input required className={input} name="days" placeholder="مثلاً ۲ تا ۳ روز کاری" defaultValue={rule?.days}/></label>
      <button className={primary}>{editing ? "ذخیره تغییرات" : "افزودن مقصد"}</button>{editing && <button type="button" onClick={()=>setEditing("")}>انصراف</button>}
    </form><p role="status" className="mt-3 text-sm text-accent">{message}</p></section>;
}
