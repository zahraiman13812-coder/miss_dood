"use client";

import { useState } from "react";
import { dialLink, storeContact } from "@/data/storeContact";

export default function ContactPage() {
  const [message,setMessage] = useState("");
  const [preview,setPreview] = useState(false);
  return <main className="mx-auto w-full max-w-3xl space-y-6 px-5 py-12">
    <h1 className="text-3xl font-bold">تماس با میس دود</h1>
    <div className="space-y-2 rounded-2xl border border-line bg-panel p-6">
      <h2 className="font-bold text-accent">نشانی فروشگاه</h2>
      <address className="not-italic leading-8">{storeContact.address}</address>
      {storeContact.phone && <a href={dialLink(storeContact.phone)} className="text-accent"><bdi>{storeContact.phone}</bdi></a>}
    </div>
    <form className="space-y-4" onSubmit={e=>{e.preventDefault();setPreview(true);}}>
      <label className="block">پیام شما<textarea required minLength={5} maxLength={2000} rows={4} value={message} onChange={e=>{setMessage(e.target.value);setPreview(false);}} className="mt-2 block w-full rounded-xl border border-line bg-panel p-4"/></label>
      <button className="rounded-xl bg-accent px-5 py-3 text-on-accent">پیش‌نمایش پیام</button>
    </form>
    {preview && <section aria-live="polite" className="space-y-2 rounded-xl border border-line p-4"><h2 className="font-bold">پیش‌نمایش پیام</h2><p className="whitespace-pre-wrap break-words">{message}</p><p className="text-sm text-muted">این پیام برای فروشگاه ارسال نشده است.</p></section>}
  </main>;
}
