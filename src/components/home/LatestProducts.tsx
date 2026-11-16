"use client";

import ProductCard from "@/features/catalog/ProductCard";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { latestProducts } from "@/data/mock/latestProducts";

export default function LatestProducts() {
  const track = useRef<HTMLUListElement>(null);

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
          <li key={p.slug} className="w-[76%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[30%]">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
