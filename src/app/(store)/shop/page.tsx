import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { budgets } from "@/components/home/BudgetLinks";
import { latestProducts } from "@/data/mock/latestProducts";
import { categories } from "@/data/navigation";
import ProductCard from "@/features/catalog/ProductCard";

import { decorProductSlugs } from "@/data/decorProducts";

const shopCategories = [...categories, ["decor", "محصولات تزئینی"] as const];
type Params = { category?: string; q?: string; budget?: string };

export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { category, q, budget } = await searchParams;
  const selected = shopCategories.find(([slug]) => slug === category);
  if (category && !selected) notFound();

  const range = budgets.find(b => b.key === budget);
  const query = typeof q === "string" ? q.trim() : "";
  const isDecor = category === "decor";
  const matches = latestProducts.filter(p =>
    (!selected || (isDecor ? decorProductSlugs.has(p.slug) : p.category === selected[0])) &&
    (!query || p.name.includes(query) || p.description.includes(query)) &&
    (!range || (p.priceToman !== null && p.priceToman >= range.min && p.priceToman < range.max))
  );
  const separateDecor = !selected || isDecor;
  const visibleDecor = separateDecor ? matches.filter(p => decorProductSlugs.has(p.slug)) : [];
  const products = separateDecor ? matches.filter(p => !decorProductSlugs.has(p.slug)) : matches;
  const count = matches.length;
  const title = selected?.[1] ?? range?.label ?? (query ? "نتایج جست‌وجو" : "همه محصولات");
  const filterParams = { ...(query && { q: query }), ...(range && { budget: range.key }) };
  const chip = "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm border-line bg-panel text-content hover:border-accent aria-[current=page]:border-accent aria-[current=page]:bg-accent aria-[current=page]:text-on-accent";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-8">
      <nav aria-label="مسیر صفحه" className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Link href="/">خانه</Link><span aria-hidden="true">/</span><Link href="/shop">فروشگاه</Link>
        {selected && <><span aria-hidden="true">/</span><span aria-current="page">{selected[1]}</span></>}
      </nav>
      <header className="flex items-center justify-between gap-5 rounded-2xl border border-line bg-linear-to-l from-panel to-header px-5 py-4 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-content sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">{count.toLocaleString("fa-IR")} محصول</p>
        </div>
        {selected && !isDecor && <Image src={`/images/categories/${selected[0]}.webp`} width={96} height={96} alt="" className="size-20 object-contain sm:size-24" />}
      </header>
      <nav aria-label="انتخاب دسته‌بندی" className="my-5 flex gap-2 overflow-x-auto p-1 sm:flex-wrap">
        <Link className={chip} href={{pathname:"/shop", query:filterParams}} aria-current={!selected ? "page" : undefined}>همه دسته‌ها</Link>
        {shopCategories.map(([slug, label]) => (
          <Link key={slug} href={{pathname:"/shop", query:{...filterParams, category:slug}}}
            className={chip} aria-current={selected?.[0] === slug ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      {(query || range) && <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted">
        {query && <span>جست‌وجو: {query}</span>}{range && <span>{range.label}</span>}
        <Link className="text-accent underline" href={{pathname:"/shop", query:selected ? {category:selected[0]} : {}}}>پاک‌کردن فیلترها</Link>
      </div>}
      {products.length > 0 && <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(p => <li key={p.slug}><ProductCard product={p}/></li>)}
      </ul>}
      {visibleDecor.length > 0 && <section aria-label="محصولات تزئینی" className="my-6">
        {!isDecor && <h2 className="mb-4 text-xl font-bold">محصولات تزئینی</h2>}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleDecor.map(item => <li key={item.slug}><ProductCard product={item}/></li>)}
        </ul>
      </section>}
      {count === 0 && <section className="rounded-2xl border border-line bg-panel px-4 py-12 text-center">
        <p>{query || range ? "محصولی با این فیلترها پیدا نشد." : "هنوز محصولی در این دسته ثبت نشده است."}</p>
        <Link href="/shop" className="mt-5 inline-block rounded-xl border border-line px-5 py-3 text-accent">مشاهده همه محصولات</Link>
      </section>}
    </main>
  );
}
