"use client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Search, RefreshCw } from "lucide-react";
import { budgets } from "@/components/home/BudgetLinks";
import { useStore, refreshCatalog } from "@/features/store/useStore";

import { brands } from "@/data/brands";
import { categories } from "@/data/navigation";
import { decorProductSlugs } from "@/data/decorProducts";
import ProductCard from "@/features/catalog/ProductCard";

import FilterPanel from "@/features/catalog/FilterPanel";

const departments = [...categories, ["decor", "محصولات تزئینی"] as const];
const field = "mt-2 block min-h-11 w-full rounded-xl border border-line bg-header px-3 py-2 text-sm text-content";
const normalize = (s: string) => s.normalize("NFKC").toLowerCase().replace(/ي/g,"ی").replace(/ك/g,"ک").replace(/[\s\u200c]+/g," ").trim();
type Params = Record<string, string | string[] | undefined>;

export default function ShopCatalog({params}: {params: Params}) {
  const {products:latestProducts,stock,catalogStatus}=useStore();
  function value(key: string) {
    const input = params[key];
    return (Array.isArray(input) ? input[0] : input)?.trim() || "";
  }
  const category = departments.find(([key]) => key === value("category"));
  const brand = brands.find(b => b.slug === value("brand"));
  if ((value("category") && !category) || (value("brand") && !brand)) notFound();
  const budget = budgets.find(b => b.key === value("budget"));
  const query = value("q");
  const sort = value("sort");
  const inStock = value("available") === "1";
  const tokens = normalize(query).split(" ").filter(Boolean);
  const products = latestProducts.filter(p => {
    const label = categories.find(([slug]) => slug === p.category)?.[1];
    const keywords = normalize([p.name, p.description, label, brands.find(b=>b.slug===p.brand)?.name].join(" "));
    return (!category || (category[0] === "decor" ? decorProductSlugs.has(p.slug) : category[0] === p.category)) &&
      (!brand || brand.slug===p.brand) &&
      (!inStock || (stock[p.slug] ?? 0) > 0) &&
      (!budget || (p.priceToman !== null && p.priceToman >= budget.min && p.priceToman < budget.max)) &&
      tokens.every(word => keywords.includes(word));
  });
  if (sort === "low" || sort === "high") products.sort((a,b) => {
    if (a.priceToman === null) return b.priceToman === null ? 0 : 1;
    if (b.priceToman === null) return -1;
    return sort === "low" ? a.priceToman - b.priceToman : b.priceToman - a.priceToman;
  });
  if(sort === "az") products.sort((a,b) => a.name.localeCompare(b.name,"fa"));
  const title = brand ? 'محصولات ' + brand.name : category?.[1] || (query ? "نتایج جست‌وجو" : "فروشگاه میس دود");
  const active = [category?.[1],brand?.name,budget?.label,query,inStock ? "فقط کالاهای موجود" : ""].filter(Boolean);
  return <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8">
    <nav aria-label="مسیر صفحه" className="mb-4 flex gap-3 text-sm text-muted"><Link href="/">خانه</Link><span>/</span><Link href="/shop">فروشگاه</Link></nav>
    <header className="relative isolate flex min-h-44 items-center overflow-hidden rounded-3xl border border-line bg-header px-6 py-9 sm:px-10">
      <Image src="/images/hero/miss-dood-2.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center"/>
      <div className="absolute inset-0 -z-10 bg-linear-to-l from-header via-header/90 to-header/40"/>
      <div><h1 className="text-3xl font-bold text-content sm:text-4xl">{title}</h1>
        <Link href="/favorites" className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/60 bg-header/80 px-4 py-2 text-sm text-accent"><Heart size={16}/>علاقه‌مندی‌های من</Link></div>
    </header>
    <div className="mt-5 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <FilterPanel>
        <form action="/shop" key={JSON.stringify(params)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <label className="text-sm text-muted">نام کالا<input name="q" type="search" className={field} defaultValue={query} placeholder="مثلاً فندک"/></label>
          <label className="text-sm text-muted">دسته‌بندی<select name="category" className={field} defaultValue={category?.[0] || ""}><option value="">همه دسته‌ها</option>{departments.map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></label>
          <label className="text-sm text-muted">برند<select name="brand" className={field} defaultValue={brand?.slug || ""}><option value="">همه برندها</option>{brands.map(b=><option key={b.slug} value={b.slug}>{b.name}</option>)}</select></label>
          <label className="text-sm text-muted">محدوده قیمت<select name="budget" className={field} defaultValue={budget?.key || ""}><option value="">همه قیمت‌ها</option>{budgets.map(b=><option key={b.key} value={b.key}>{b.label}</option>)}</select></label>
          <label className="text-sm text-muted">مرتب‌سازی<select name="sort" className={field} defaultValue={sort}><option value="">ترتیب کاتالوگ</option><option value="low">ارزان‌ترین</option><option value="high">گران‌ترین</option><option value="az">نام کالا (الفبا)</option></select></label>
          <label className="flex min-h-11 items-center gap-3 rounded-xl border border-line px-3 text-sm text-content"><input type="checkbox" name="available" value="1" defaultChecked={inStock} className="size-4 accent-accent"/>فقط کالاهای موجود</label>
          <button className="rounded-xl bg-accent px-4 py-3 font-bold text-on-accent">نمایش نتایج</button>
        </form>
      </FilterPanel>
      <section aria-label="نتایج محصولات" aria-busy={catalogStatus==="loading"}>
        {catalogStatus === "loading" && <p role="status" className="mb-4 rounded-xl border border-line bg-panel px-4 py-3 text-sm">در حال دریافت کالاها و قیمت‌های به‌روز از فروشگاه…</p>}
        {catalogStatus === "error" && <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel px-4 py-3"><p className="text-sm">ارتباط با کاتالوگ برقرار نشد. قیمت و موجودی تا زمان اتصال نمایش داده نمی‌شود.</p><button type="button" onClick={()=>void refreshCatalog(true)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-accent px-3 text-sm text-accent"><RefreshCw size={16}/>تلاش مجدد</button></div>}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <h2 className="text-xl font-bold">محصولات <span className="ms-1 text-sm font-normal text-muted">({products.length.toLocaleString("fa-IR")})</span></h2>
          {(active.length > 0 || sort) && <Link href="/shop" className="text-sm text-accent">پاک‌کردن فیلترها</Link>}
        </div>
        {!!active.length && <p className="mb-4 break-words text-sm text-muted">{active.join(" · ")}</p>}
        {catalogStatus === "ready" && products.length ? <ul className="grid gap-4 min-[36rem]:grid-cols-2 xl:grid-cols-3">{products.map(p=><li key={p.slug}><ProductCard product={p} saveable/></li>)}</ul> : catalogStatus === "ready" ?
        <div className="grid justify-items-center gap-4 rounded-2xl border border-line bg-panel p-10 text-center"><Search className="text-accent"/><h3 className="font-bold">محصولی پیدا نشد</h3><p className="text-sm text-muted">عبارت کوتاه‌تری بنویسید یا محدودهٔ جست‌وجو را تغییر دهید.</p><Link href="/shop" className="text-accent">دیدن همهٔ محصولات</Link></div> : null}
      </section>
    </div>
  </main>;
}
