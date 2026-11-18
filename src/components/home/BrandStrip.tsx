"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useStore } from "@/features/store/useStore";
import { brands } from "@/data/brands";

const control = "grid size-11 place-items-center rounded-full border border-line text-accent hover:bg-panel";

export default function BrandStrip() {
  const {products}=useStore();
  const list = useRef<HTMLUListElement>(null);
  function scroll(direction: number) {
    const rail = list.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * rail.clientWidth * 0.8,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <section dir="rtl" aria-labelledby="brands-title" className="mx-auto max-w-7xl px-4 pb-12 sm:px-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="brands-title" className="text-xl font-bold sm:text-2xl">انتخاب بر اساس برند</h2>
        <div className="flex gap-2">
          <button type="button" className={control} aria-label="برندهای قبلی" onClick={()=>scroll(1)}><ChevronRight size={18}/></button>
          <button type="button" className={control} aria-label="برندهای بعدی" onClick={()=>scroll(-1)}><ChevronLeft size={18}/></button>
        </div>
      </div>
      <ul ref={list} className="flex snap-x snap-mandatory gap-3 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {brands.map(brand => (
          <li key={brand.slug} className="w-28 shrink-0 snap-start sm:w-36">
            <BrandTile slug={brand.slug} active={products.some(p=>p.brand===brand.slug)} className="group block rounded-2xl border border-line bg-panel p-2 hover:border-accent">
              <span className="grid h-20 place-items-center rounded-xl bg-content sm:h-24">
                <Image src={`/images/brands/${brand.slug}.webp`} alt="" width={100} height={80}
                  className="h-[78%] w-[80%] object-contain motion-safe:transition-transform motion-safe:group-hover:scale-105"/>
              </span>
              <bdi className="mt-2 block truncate text-center text-sm font-semibold text-content">{brand.name}</bdi>
            </BrandTile>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BrandTile({slug,active,className,children}:{slug:string;active:boolean;className:string;children:React.ReactNode}) {
  return active ? <Link href={{pathname:"/shop",query:{brand:slug}}} className={className}>{children}</Link> :
    <span title="کالایی از این برند ثبت نشده است" className={className+" opacity-60"}>{children}</span>;
}
