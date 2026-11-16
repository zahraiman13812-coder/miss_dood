"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { latestProducts, productPrice } from "@/data/mock/latestProducts";

const control = "grid size-11 place-items-center rounded-full border border-line text-accent enabled:hover:border-accent disabled:opacity-30";

export default function LatestProducts() {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ first: true, last: false });

  useEffect(() => {
    const list = track.current;
    if (!list) return;
    function update() {
      if (!list) return;
      const offset = Math.abs(list.scrollLeft);
      setEdges({ first: offset < 2, last: offset + list.clientWidth >= list.scrollWidth - 2 });
    }
    const observer = new ResizeObserver(update);
    observer.observe(list);
    list.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); list.removeEventListener("scroll", update); };
  }, []);

  function move(direction: number) {
    const list = track.current;
    const card = list?.firstElementChild;
    if (!list || !card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap);
    list.scrollBy({ left: -direction * step, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <section aria-labelledby="latest-title" className="mx-auto max-w-7xl px-4 pb-12 sm:px-8" dir="rtl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 id="latest-title" className="me-auto text-xl font-bold text-content sm:text-2xl">تازه‌های میس دود</h2>
        <Link href="/shop" className="px-1 text-sm text-accent hover:underline">مشاهده همه</Link>
        <div className="flex gap-1">
          <button type="button" className={control} disabled={edges.first} onClick={() => move(-1)} aria-label="محصول قبلی"><ChevronRight size={18}/></button>
          <button type="button" className={control} disabled={edges.last} onClick={() => move(1)} aria-label="محصول بعدی"><ChevronLeft size={18}/></button>
        </div>
      </div>
      <ul ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto p-1 pb-3">
        {latestProducts.map(product => (
          <li key={product.slug} className="w-[83%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
            <Link href={'/products/' + product.slug} className="group block overflow-hidden rounded-2xl border border-line bg-panel hover:border-accent focus-visible:border-accent">
              <div className="relative grid aspect-[1.9] place-items-center bg-radial from-accent/15 via-panel to-header">
                <div aria-hidden="true" className="absolute aspect-square h-4/5 rounded-full border border-accent/20" />
                <Image width={240} height={240} src={product.image} alt="" className="absolute h-[80%] w-[70%] object-contain motion-safe:transition-transform motion-safe:group-hover:-translate-y-1" />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line p-4 sm:p-5">
                <div><h3 className="font-bold text-content">{product.name}</h3><p className="mt-2 text-sm text-muted">{productPrice(product.priceToman)}</p></div>
                <span className="grid size-9 place-items-center rounded-full border border-line text-accent group-hover:bg-accent group-hover:text-on-accent"><ArrowUpLeft size={17}/></span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
