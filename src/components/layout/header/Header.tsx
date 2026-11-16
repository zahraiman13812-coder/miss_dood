"use client";
import { useCart } from "@/features/cart/useCart";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Grid2X2, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { categories, pages } from "@/data/navigation";

const action = "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md hover:bg-panel hover:text-accent";
function CategoryLinks({ close }: { close: () => void }) {
  return <div className="grid grid-cols-2 gap-1">{categories.map(([slug, label]) =>
    <Link key={slug} href={'/shop?category=' + slug} onClick={close} className="rounded px-4 py-3 hover:bg-header hover:text-accent">{label}</Link>)}</div>;
}
function SearchForm({ focus = false }: { focus?: boolean }) {
  return <form action="/shop" role="search" className="flex items-center gap-2 rounded-md border border-line bg-header p-2">
    <input name="q" type="search" required autoFocus={focus} aria-label="جست‌وجوی کالا" placeholder="جست‌وجوی کالا…" className="min-w-0 flex-1 px-2 py-2 placeholder:text-muted" />
    <button aria-label="اجرای جست‌وجو" className={action}><Search size={18}/></button></form>;
}
export default function Header() {
  const count = Object.values(useCart()).reduce((sum, qty) => sum + qty, 0).toLocaleString("fa-IR");
  const path = usePathname();
  const [open, setOpen] = useState<"categories" | "search" | null>(null);
  const header = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const categoryButton = useRef<HTMLButtonElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const outside = (e: PointerEvent) => { if (!header.current?.contains(e.target as Node)) setOpen(null); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape" && open) {
      (open === "search" ? searchButton : categoryButton).current?.focus(); setOpen(null);
    }};
    const breakpoint = matchMedia("(min-width: 64rem)");
    const reset = () => { drawer.current?.close(); setOpen(null); };
    breakpoint.addEventListener("change",reset);
    document.addEventListener("pointerdown",outside); document.addEventListener("keydown",escape);
    return () => { breakpoint.removeEventListener("change",reset); document.removeEventListener("pointerdown",outside); document.removeEventListener("keydown",escape); };
  }, [open]);
  const close = () => { setOpen(null); drawer.current?.close(); };
  const navLinks = pages.map(([href,label]) => <Link key={href} href={href} onClick={close} aria-current={path===href ? "page" : undefined}
    className="py-3 hover:text-accent aria-[current=page]:text-accent aria-[current=page]:underline underline-offset-8">{label}</Link>);
  return <header ref={header} className="sticky top-0 z-50 shrink-0 border-b border-line bg-header text-sm">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
      <button className={action+" lg:hidden"} aria-label="باز کردن منو" onClick={()=>drawer.current?.showModal()}><Menu/></button>
      <Link href="/" onClick={close} aria-label="میس دود، صفحه اصلی"><Image src="/brand/miss-dood-logo.jpg" alt="MISS DOOD" width={112} height={112} priority className="size-20 object-contain lg:size-28"/></Link>
      <nav aria-label="منوی اصلی" className="hidden items-center gap-7 lg:flex">
        <div className="relative"><button ref={categoryButton} aria-expanded={open==="categories"} onClick={()=>setOpen(open==="categories"?null:"categories")} className={action+" px-3 text-accent"}><Grid2X2 size={17}/>دسته‌بندی کالا<ChevronDown size={15}/></button>
        {open==="categories" && <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-line bg-panel p-3"><CategoryLinks close={close}/></div>}</div>{navLinks}</nav>
      <div className="flex items-center gap-2 lg:ms-auto">
        <div className="relative hidden lg:block"><button ref={searchButton} aria-label="جست‌وجو" aria-expanded={open==="search"} className={action} onClick={()=>setOpen(open==="search"?null:"search")}><Search size={21}/></button>
        {open==="search" && <div className="absolute left-0 top-full mt-2 w-80 rounded-md border border-line bg-panel p-2"><SearchForm focus/></div>}</div>
        <Link href="/login" onClick={close} className={action+" hidden px-3 lg:inline-flex"}><UserRound size={19}/>ورود کاربر</Link>
        <Link href="/cart" onClick={close} aria-label={`سبد خرید، ${count} کالا`} className={action+" border border-line px-2 text-accent"}><ShoppingBag size={19}/><span>{count}</span></Link>
      </div>
    </div>
    <dialog ref={drawer} aria-labelledby="menu-title" className="border-e border-line bg-panel p-5 text-content" onClick={e=>{if(e.target===drawer.current && e.clientX < e.currentTarget.getBoundingClientRect().left) close();}}>
      <div className="mb-5 flex items-center justify-between"><strong id="menu-title" className="text-accent">منوی فروشگاه</strong><button className={action} onClick={close} aria-label="بستن منو"><X/></button></div>
      <SearchForm/><nav aria-label="منوی موبایل" className="mt-5 flex flex-col gap-2">
        <details className="border-b border-line pb-2"><summary className="py-3 text-accent">دسته‌بندی کالا</summary><CategoryLinks close={close}/></details>
        {navLinks}<Link href="/login" onClick={close} className="flex items-center gap-2 py-3"><UserRound size={18}/>ورود کاربر</Link>
      </nav>
    </dialog>
  </header>;
}
