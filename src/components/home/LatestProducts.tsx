"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { latestProducts, productPrice } from "@/data/mock/latestProducts";
import { changeQuantity, useCart } from "@/features/cart/useCart";

export default function LatestProducts() {
  const track = useRef<HTMLUListElement>(null);
  const cart = useCart();

  useEffect(() => {
    const list = track.current;
    if (!list) return;
    let timer: number;
    let touching = false;
    function schedule() {
      window.clearTimeout(timer);
      timer = window.setTimeout(advance, 5000);
    }
    function advance() {
      if (!list) return;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.hidden && !touching && !reduced && !list.matches(":focus-within") &&
          !(matchMedia("(hover: hover)").matches && list.matches(":hover"))) {
        const card = list.firstElementChild;
        if (card) {
          const end = Math.abs(list.scrollLeft) + list.clientWidth >= list.scrollWidth - 2;
          const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap);
          list.scrollTo({left: end ? 0 : list.scrollLeft - step, behavior: "smooth"});
        }
      }
      schedule();
    }
    function start() { touching = true; }
    function finish() { touching = false; schedule(); }
    list.addEventListener("pointerdown", start);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    list.addEventListener("scroll", schedule, {passive: true});
    schedule();
    return () => {
      clearTimeout(timer);
      list.removeEventListener("pointerdown", start);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      list.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <section aria-labelledby="latest-title" className="mx-auto max-w-7xl px-4 pb-12 sm:px-8" dir="rtl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="latest-title" className="text-xl font-bold sm:text-2xl">تازه‌های میس دود</h2>
        <Link href="/shop" className="text-sm text-accent hover:underline">مشاهده همه</Link>
      </div>
      <ul ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {latestProducts.map(p => (
          <li key={p.slug} className="relative isolate w-[83%] shrink-0 snap-start rounded-2xl border border-line bg-panel hover:border-accent sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
            <div className="relative grid aspect-[1.9] place-items-center overflow-hidden rounded-t-2xl bg-radial from-accent/20 via-panel to-header">
              <span aria-hidden="true" className="absolute aspect-square h-4/5 rounded-full border border-accent/20" />
              <Image src={p.image} alt="" width={240} height={240} className="absolute h-[80%] w-[70%] object-contain"/>
            </div>
            <div className="border-t border-line p-4 sm:p-5">
              <h3 className="text-lg font-bold"><Link href={'/products/' + p.slug} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-focus">{p.name}</Link></h3>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-bold text-accent">{productPrice(p.priceToman)}</p>
                <button type="button" onClick={() => changeQuantity(p.slug, 1)} aria-label={'افزودن ' + p.name + ' به سبد خرید'}
                  className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-bold text-on-accent hover:brightness-110">
                  <ShoppingBag size={17}/><span>افزودن</span>
                  {cart[p.slug] > 0 && <span>({cart[p.slug].toLocaleString("fa-IR")})</span>}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
