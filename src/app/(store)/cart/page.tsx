"use client";

import Link from "next/link";
import { latestProducts, productPrice } from "@/data/mock/latestProducts";
import { changeQuantity, useCart } from "@/features/cart/useCart";

export default function CartPage() {
  const cart = useCart();
  const products = latestProducts.filter(p => cart[p.slug]);
  const knownTotal = products.every(p => p.priceToman !== null);
  const total = products.reduce((sum, p) => sum + (p.priceToman ?? 0) * cart[p.slug], 0);
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="mb-6 text-2xl text-accent">سبد خرید</h1>
      {products.length === 0 ? <p>سبد خرید شما خالی است.</p> : <>
        <ul className="divide-y divide-line">{products.map(p => (
          <li key={p.slug} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div><Link href={'/products/' + p.slug}>{p.name}</Link><p className="text-sm text-muted">{productPrice(p.priceToman)}</p></div>
            <div className="flex items-center gap-2 rounded-full border border-line">
              <button className="size-11" aria-label={'افزایش تعداد ' + p.name} onClick={() => changeQuantity(p.slug, 1)}>+</button>
              <span>{cart[p.slug].toLocaleString("fa-IR")}</span>
              <button className="size-11" aria-label={'کاهش تعداد ' + p.name} onClick={() => changeQuantity(p.slug, -1)}>−</button>
            </div>
          </li>
        ))}</ul>
        <p className="border-t border-line pt-4 text-accent">جمع سبد خرید · {productPrice(knownTotal ? total : null)}</p>
      </>}
    </main>
  );
}
