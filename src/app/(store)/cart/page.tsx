"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { productPrice } from "@/data/mock/latestProducts";
import { useCart } from "@/features/cart/useCart";
import { summarizeCart } from "@/features/cart/cartSummary";
import ProductQuantity from "@/features/cart/ProductQuantity";

export default function CartPage() {
  const { lines, count, total } = summarizeCart(useCart());
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-2xl font-bold">سبد خرید</h1>
      {count === 0 ? (
        <div className="grid justify-items-center gap-5 rounded-3xl border border-line bg-panel px-4 py-16">
          <ShoppingBag aria-hidden="true" className="size-10 text-accent" />
          <p>سبد خرید شما خالی است.</p>
          <Link className="rounded-xl bg-accent px-6 py-3 font-bold text-on-accent" href="/shop">بازگشت به فروشگاه</Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
          <ul className="divide-y divide-line rounded-2xl border border-line bg-panel px-4 sm:px-6">
            {lines.map(({ product, quantity, amount }) => (
              <li key={product.slug} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[6rem_minmax(0,1fr)_9rem] sm:items-center">
                <Link href={'/products/' + product.slug} className="relative aspect-square rounded-xl bg-header">
                  <Image fill sizes="96px" src={product.image} alt={product.name} className="object-contain p-2" />
                </Link>
                <div>
                  <Link href={'/products/' + product.slug} className="font-bold hover:text-accent">{product.name}</Link>
                  <p className="mt-1 text-sm text-muted">قیمت واحد · {productPrice(product.priceToman)}</p>
                  <p className="mt-2 text-sm text-content">جمع {quantity.toLocaleString("fa-IR")} عدد · {productPrice(amount)}</p>
                </div>
                <div className="col-span-2 w-36 sm:col-span-1"><ProductQuantity product={product} /></div>
              </li>
            ))}
          </ul>
          <aside aria-label="خلاصه سفارش" className="sticky bottom-0 z-20 rounded-2xl border border-line bg-header p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:top-32 lg:bottom-auto lg:p-6">
            <h2 className="text-lg font-bold">خلاصهٔ سفارش</h2>
            <div className="mt-2 flex justify-between gap-2 text-sm text-muted"><span>تعداد کالاها</span><span>{count.toLocaleString("fa-IR")}</span></div>
            <div className="my-3 flex flex-wrap justify-between gap-2 border-t border-line pt-3"><span>جمع کالاها</span><strong className="text-accent">{productPrice(total)}</strong></div>
            {total !== null ? <Link href="/checkout" className="block rounded-xl bg-accent px-4 py-3 text-center font-bold text-on-accent">ادامهٔ ثبت سفارش</Link>
              : <p className="text-sm text-muted">قیمت بعضی از کالاها هنوز ثبت نشده است.</p>}
          </aside>
        </div>
      )}
    </main>
  );
}
