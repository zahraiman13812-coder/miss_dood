"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function FilterPanel({ children }: {children: ReactNode}) {
  const [open, setOpen] = useState(false);
  return <aside className="rounded-2xl border border-line bg-panel p-4 lg:p-5">
    <h2 className="hidden items-center gap-2 font-bold lg:flex"><SlidersHorizontal size={18} className="text-accent"/>جست‌وجو و فیلتر</h2>
    <button type="button" aria-expanded={open} aria-controls="catalog-filter" onClick={() => setOpen(!open)}
      className="flex min-h-11 w-full items-center gap-2 font-bold lg:hidden">
      <SlidersHorizontal className="text-accent" size={18}/>جست‌وجو و فیلتر<ChevronDown size={16} className="ms-auto"/>
    </button>
    <div id="catalog-filter" className={`mt-4 lg:block ${open ? "block" : "hidden"}`}>{children}</div>
  </aside>;
}
