"use client";

import Link from "next/link";
import { MapPin, PackageSearch } from "lucide-react";
import SupportDesk from "@/features/support/SupportDesk";
import { dialLink, storeContact } from "@/data/storeContact";

export default function ContactPage() {
  return <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-8 lg:py-10">
    <h1 className="text-3xl font-bold">تماس با میس دود</h1>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"><aside className="space-y-3">
    <div className="space-y-2 rounded-2xl border border-line bg-panel p-6">
      <h2 className="font-bold text-accent"><MapPin size={18} className="me-2 inline"/>نشانی فروشگاه</h2>
      <address className="not-italic leading-8">{storeContact.address}</address>
      {storeContact.phones.filter(Boolean).map(phone => <a key={phone} href={dialLink(phone)} className="block text-accent"><bdi>{phone}</bdi></a>)}
    </div>
    <Link href="/orders" className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-5 hover:border-accent"><PackageSearch className="text-accent"/><div><strong>پیگیری سفارش</strong><p className="mt-1 text-sm text-muted">مشاهده رسید و جست‌وجو با شناسه سفارش</p></div></Link>
    </aside><SupportDesk/></div>
  </main>;
}
