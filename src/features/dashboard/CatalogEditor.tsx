"use client";

import { useState, type FormEvent } from "react";
import { categories } from "@/data/navigation";
import { brands } from "@/data/brands";
import { useStore } from "@/features/store/useStore";
import { updateStore, type CatalogItem } from "@/features/store/store";
import { card, input, primary } from "./Panel";

async function photo(file:File):Promise<string> {
  if (!["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error("عکس را با فرمت JPG، PNG یا WebP انتخاب کنید.");
  const image=await createImageBitmap(file);
  try {
    const scale=Math.min(1,960/Math.max(image.width,image.height));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
    const context=canvas.getContext("2d");
    if (!context) throw new Error("خواندن تصویر ممکن نیست.");
    context.drawImage(image,0,0,canvas.width,canvas.height);
    return canvas.toDataURL("image/webp",0.8);
  } finally { image.close(); }
}
export default function CatalogEditor() {
  const {products,stock,shipping}=useStore();
  const [selected,setSelected]=useState(products[0]?.slug ?? "");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const item=products.find(p=>p.slug===selected);
  async function save(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();setMessage("");setBusy(true);
    const fields=new FormData(e.currentTarget);
    const value=(key:string)=>String(fields.get(key) ?? "").trim();
    try {
      const price=Number(value("price")), stock=Number(value("stock"));
      if (!value("name") || !value("description") || !value("price") || !value("stock") || !Number.isSafeInteger(price) || price<0 || !Number.isSafeInteger(stock) || stock<0) throw new Error("نام، توضیحات، قیمت و موجودی معتبر را وارد کنید.");
      const specs:[string,string][] = value("specs").split("\n").filter(line=>line.trim()).map(line=>{
        const pos=line.indexOf(":");
        const label=line.slice(0,pos).trim(),detail=line.slice(pos+1).trim();
        if(pos<1 || !label || !detail) throw new Error("هر مشخصه را به صورت «عنوان: مقدار» بنویسید.");
        return [label,detail];
      });
      const file=fields.get("photo") as File;
      const image=file?.size ? await photo(file) : item?.image;
      if (!image) throw new Error("عکس کالا را انتخاب کنید.");
      const slug=item?.slug || "item-"+crypto.randomUUID();
      const next:CatalogItem={slug,name:value("name"),category:value("category"),priceToman:price,
        brand:value("brand"),description:value("description"),image,specs,edited:true};
      updateStore(s=>({...s,products:item ? s.products.map(p=>p.slug===slug ? next : p) : [next,...s.products],stock:{...s.stock,[slug]:stock}}));
      setSelected(slug);setMessage("اطلاعات کالا در کاتالوگ فروشگاه ذخیره شد.");
    } catch(err) { setMessage(err instanceof DOMException ? "ذخیره انجام نشد؛ حجم تصویر یا فضای مرورگر را بررسی کنید." : err instanceof Error ? err.message : "ذخیره ممکن نیست."); }
    finally { setBusy(false); }
  }
  function exportCatalog() {
    const blob=new Blob([JSON.stringify({products,stock,shipping},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;link.download="storefront.json";link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <section className={card}><label className="block font-bold">انتخاب کالا<select disabled={busy} className={input} value={selected} onChange={e=>{setSelected(e.target.value);setMessage("");}}>
    <option value="">＋ افزودن کالای جدید</option>{products.map(p=><option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>
    <form key={selected} onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
      <label>نام کالا<input required maxLength={120} name="name" className={input} defaultValue={item?.name}/></label>
      <label>برند<select name="brand" className={input} defaultValue={item?.brand}><option value="">بدون برند ثبت‌شده</option>{brands.map(b=><option key={b.slug} value={b.slug}>{b.name}</option>)}</select></label>
      <label>دسته‌بندی<select name="category" className={input} defaultValue={item?.category}>{categories.map(([slug,label])=><option key={slug} value={slug}>{label}</option>)}</select></label>
      <label>قیمت (تومان)<input name="price" type="number" min="0" step="1" required className={input} defaultValue={item?.priceToman ?? ""}/></label>
      <label>موجودی (عدد)<input name="stock" type="number" min="0" step="1" required className={input} defaultValue={stock[selected] ?? ""}/></label>
      <label>عکس کالا<input className={input} type="file" name="photo" accept="image/jpeg,image/png,image/webp" required={!item}/></label>
      <label className="sm:col-span-2">توضیحات<textarea className={input} name="description" required rows={2} defaultValue={item?.description}/></label>
      <label className="sm:col-span-2">مشخصات، هر سطر یک «عنوان: مقدار»<textarea className={input} name="specs" rows={4} defaultValue={item?.specs.map(([k,v])=>k+": "+v).join("\n")}/></label>
      <button disabled={busy} className={primary}>{busy ? "در حال ذخیره…" : "ذخیره کالا"}</button>
    </form><div className="mt-5 border-t border-line pt-4"><button type="button" className="text-sm text-accent" onClick={exportCatalog}>دریافت فایل کاتالوگ، موجودی و تعرفه‌ها</button></div><p role="status" className="mt-3 text-sm text-accent">{message}</p></section>;
}
