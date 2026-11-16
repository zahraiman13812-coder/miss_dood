"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { productPrice, type Product } from "@/data/mock/latestProducts";
import { changeQuantity, useCart } from "@/features/cart/useCart";

export default function ProductCard({ product: p }: { product: Product }) {
  const cart = useCart();
  return (
    <article className="relative isolate h-full overflow-hidden rounded-xl border border-line bg-panel hover:border-accent focus-within:border-accent">
      <div className="relative grid aspect-[1.55] place-items-center overflow-hidden bg-linear-to-b from-header to-panel">
        <Image src={p.image} alt="" width={240} height={240} className="absolute h-[80%] w-[70%] object-contain"/>
      </div>
      <div className="border-t border-line p-4 sm:p-5">
        <h3 className="text-lg font-bold"><Link href={'/products/' + p.slug} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-focus">{p.name}</Link></h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted">{p.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-bold tabular-nums text-content">{productPrice(p.priceToman)}</p>
          <div role="group" aria-label={`تعداد ${p.name} در سبد خرید`}
            className="relative z-10 inline-flex items-center gap-1 rounded-full border border-line bg-header p-1 focus-within:border-accent">
            <button type="button" aria-label={`افزایش تعداد ${p.name}`}
              onClick={() => changeQuantity(p.slug, 1)}
              className="grid size-11 place-items-center rounded-full bg-accent text-on-accent hover:brightness-110 motion-safe:active:scale-95">
              <Plus size={18} aria-hidden="true" />
            </button>
            <output aria-label={`تعداد ${p.name}`} className="min-w-7 text-center font-bold tabular-nums text-content">
              {(cart[p.slug] ?? 0).toLocaleString("fa-IR")}
            </output>
            <button type="button" aria-label={`کاهش تعداد ${p.name}`}
              disabled={!cart[p.slug]} onClick={() => changeQuantity(p.slug, -1)}
              className="grid size-11 place-items-center rounded-full text-accent enabled:hover:bg-panel disabled:opacity-35">
              <Minus size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
