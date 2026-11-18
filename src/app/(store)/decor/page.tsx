"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft } from "lucide-react";
import { useStore } from "@/features/store/useStore";
import { productPrice } from "@/data/mock/latestProducts";
import { decorProductSlugs } from "@/data/decorProducts";

export default function DecorPage() {
  const {products:latestProducts}=useStore();
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
    <Link className="text-sm text-accent" href="/shop">بازگشت به فروشگاه</Link>
    <header className="my-7 border-s-2 border-accent ps-5">
      <h1 className="text-3xl font-bold sm:text-4xl">کاتالوگ محصولات تزئینی</h1>
      <p className="mt-3 text-muted">برای دیدن جزئیات هر مدل، تصویر آن را انتخاب کنید.</p>
    </header>
    <div className="grid gap-5 sm:grid-cols-2">{latestProducts.filter(p=>decorProductSlugs.has(p.slug)).map(p =>
      <Link key={p.slug} href={'/products/'+p.slug} className="group overflow-hidden rounded-3xl border border-line bg-panel hover:border-accent">
        <div className="relative aspect-[4/3] bg-radial from-accent/15 to-header"><Image src={p.image} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-contain p-8 motion-safe:transition-transform group-hover:scale-105"/></div>
        <div className="flex items-center justify-between gap-4 border-t border-line p-6"><div><h2 className="text-xl font-bold">{p.name}</h2><p className="mt-2 text-sm text-accent">{productPrice(p.priceToman)}</p></div>
          <ArrowUpLeft className="text-accent"/></div>
      </Link>)}</div>
  </main>;
}
