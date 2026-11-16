"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRef } from "react";
import type { Product } from "@/data/mock/latestProducts";
import { changeQuantity, useCart } from "./useCart";

export default function ProductQuantity({ product }: { product: Product }) {
  const quantity = useCart()[product.slug] ?? 0;
  const addButton = useRef<HTMLButtonElement>(null);
  const selected = quantity > 0;

  function decrease() {
    if (quantity === 1) addButton.current?.focus({ preventScroll: true });
    changeQuantity(product.slug, -1);
  }

  return (
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
  );
}
