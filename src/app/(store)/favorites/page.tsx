"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/features/store/useStore";

import { useFavorites } from "@/features/catalog/Favorites";
import ProductCard from "@/features/catalog/ProductCard";

export default function Favorites() {
  const {products:latestProducts}=useStore();
  const saved = useFavorites();
  const products = latestProducts.filter(item => saved.includes(item.slug));
  return <main className="mx-auto w-full max-w-7xl px-4 py-9 sm:px-8">
    <Link className="text-sm text-accent" href="/shop">بازگشت به فروشگاه</Link>
    <h1 className="mt-5 text-3xl font-bold">علاقه‌مندی‌ها</h1>
    <p className="my-4 text-muted">{products.length.toLocaleString("fa-IR")} کالای ذخیره‌شده در این مرورگر</p>
    {products.length ? <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => <li key={product.slug}><ProductCard product={product} saveable/></li>)}
    </ul> : <section className="grid justify-items-center gap-4 rounded-3xl border border-line bg-panel px-5 py-14 text-center">
      <Heart size={32} className="text-accent"/><h2 className="text-xl font-bold">فهرست شما خالی است</h2>
      <p className="text-muted">برای نگه داشتن کالا، قلب کنار تصویر آن را انتخاب کنید.</p>
      <Link href="/shop" className="rounded-xl bg-accent px-5 py-3 font-bold text-on-accent">دیدن محصولات</Link>
    </section>}
  </main>;
}
