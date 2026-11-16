"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRef } from "react";
import { productPrice, type Product } from "@/data/mock/latestProducts";
import { changeQuantity, useCart } from "@/features/cart/useCart";

export default function ProductCard({ product }: { product: Product }) {
  const quantity = useCart()[product.slug] ?? 0;
  const addButton = useRef<HTMLButtonElement>(null);
  const selected = quantity > 0;

  function decrease() {
    if (quantity === 1) addButton.current?.focus({ preventScroll: true });
    changeQuantity(product.slug, -1);
  }

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel text-content transition-colors hover:border-accent/70 focus-within:border-accent">
      <div className="relative grid aspect-[1.85] place-items-center overflow-hidden bg-radial from-accent/15 via-panel to-header">
        <span aria-hidden="true" className="absolute aspect-square h-4/5 rounded-full border border-accent/20" />
        <Image src={product.image} alt="" width={320} height={240}
          className="relative h-[83%] w-3/4 object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1" />
      </div>
      <div className="flex flex-1 flex-col gap-4 border-t border-line p-4 sm:p-5">
        <h3 className="text-lg font-bold">
          <Link href={'/products/' + product.slug} className="after:absolute after:inset-0 after:rounded-2xl">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto text-start text-lg font-bold tabular-nums text-accent">{productPrice(product.priceToman)}</p>
        <div role="group" aria-label={`سبد خرید، ${product.name}`}
          className={`relative z-10 flex min-h-12 items-center rounded-xl border p-0.5 ${selected ? "justify-between border-line bg-header" : "border-accent bg-accent"}`}>
          <button ref={addButton} type="button" onClick={() => changeQuantity(product.slug, 1)}
            aria-label={selected ? `افزایش تعداد ${product.name}` : `افزودن ${product.name} به سبد خرید`}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] bg-accent font-semibold text-on-accent hover:brightness-110 motion-safe:active:scale-[0.98] ${selected ? "w-11" : "w-full"}`}>
            {selected ? <Plus size={18} aria-hidden="true" /> : <><ShoppingBag size={18} aria-hidden="true" />افزودن به سبد خرید</>}
          </button>
          {selected && <>
            <output aria-label={`تعداد ${product.name}`} className="font-bold tabular-nums text-content">
              {quantity.toLocaleString("fa-IR")}
            </output>
            <button type="button" onClick={decrease} aria-label={`کاهش تعداد ${product.name}`}
              className="grid size-11 place-items-center rounded-lg text-accent hover:bg-panel">
              <Minus size={18} aria-hidden="true" />
            </button>
          </>}
        </div>
      </div>
    </article>
  );
}
