"use client";
import { useStore, refreshCatalog } from "@/features/store/useStore";
import { brands } from "@/data/brands";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productPrice } from "@/data/mock/latestProducts";
import { productDetails } from "@/data/productDetails";
import { categories } from "@/data/navigation";
import ProductCard from "@/features/catalog/ProductCard";
import ProductQuantity from "@/features/cart/ProductQuantity";

import { FavoriteButton } from "@/features/catalog/Favorites";

const families = [
  ["lighters", "fuel", "gas"],
  ["hookah", "tobacco", "charcoal"],
  ["pods", "e-liquid", "nic-salt"],
];

export default function ProductDetail({slug}:{slug:string}) {
  const {products:latestProducts,catalogStatus}=useStore();
  const product = latestProducts.find(item => item.slug === slug);
  if (!product && catalogStatus === "loading") return <main className="mx-auto p-8" role="status">در حال دریافت اطلاعات محصول…</main>;
  if (!product && catalogStatus === "error") return <main className="mx-auto max-w-2xl space-y-4 p-8"><h1 className="text-xl font-bold">اتصال به فروشگاه برقرار نشد</h1><p>برای نمایش قیمت و موجودی این محصول، اطلاعات به‌روز فروشگاه باید دریافت شود.</p><button className="rounded-xl bg-accent px-5 py-3 text-on-accent" onClick={()=>void refreshCatalog(true)}>تلاش مجدد</button></main>;
  if (!product) notFound();

  const categoryName = categories.find(([key]) => key === product.category)?.[1];
  const details = productDetails[slug];
  const specs = product.specs;
  const paragraphs = product.edited ? [] : details?.paragraphs ?? [];
  const others = latestProducts.filter(item => item.slug !== slug);
  const family = families.find(group => group.includes(product.category)) ?? [];
  const related = [
    ...others.filter(item => item.category === product.category),
    ...others.filter(item => item.category !== product.category && family.includes(item.category)),
  ].slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <nav aria-label="مسیر صفحه" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-accent">خانه</Link><span aria-hidden="true">/</span>
        <Link href="/shop" className="hover:text-accent">فروشگاه</Link>
        {categoryName && <><span aria-hidden="true">/</span><Link href={{ pathname: "/shop", query: { category: product.category } }} className="hover:text-accent">{categoryName}</Link></>}
      </nav>
      <article className="grid overflow-hidden rounded-3xl border border-line bg-panel md:grid-cols-2">
        <div className="relative isolate grid h-56 min-[25rem]:h-72 place-items-center bg-radial from-accent/15 via-header to-page sm:h-96 md:h-full md:min-h-96">
          <span aria-hidden="true" className="absolute aspect-square h-3/4 rounded-full border border-accent/15"/>
          <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 1152px) 544px, (min-width: 768px) 48vw, 95vw" className="object-contain p-7 sm:p-10"/>
        </div>
        <div className="flex flex-col justify-center gap-4 p-5 sm:p-9">
          <div className="flex items-start justify-between gap-3"><h1 className="text-2xl font-bold text-content sm:text-4xl">{product.name}</h1><FavoriteButton slug={slug} name={product.name}/></div>
          {product.brand && <Link href={'/shop?brand='+product.brand} className="w-fit text-sm text-accent">برند · {brands.find(b=>b.slug===product.brand)?.name}</Link>}
          <p className="leading-8 text-muted">{product.description}</p>
          <div className="mt-3 space-y-4 border-t border-line pt-5">
            <p className="text-2xl font-bold tabular-nums text-accent">{productPrice(product.priceToman)}</p>
            <ProductQuantity product={product}/><div className="flex justify-between gap-2 text-sm text-accent"><Link href="/cart">مشاهده سبد خرید</Link><Link href="/favorites">علاقه‌مندی‌ها</Link></div>
          </div>
        </div>
      </article>
      {(specs.length > 0 || paragraphs.length > 0) && (
        <div className={`mt-6 grid gap-4 ${specs.length > 0 && paragraphs.length > 0 ? "md:grid-cols-2" : ""}`}>
          {specs.length > 0 && <section aria-labelledby="specs-title" className="rounded-2xl border border-line bg-panel p-5 sm:p-7">
            <h2 id="specs-title" className="mb-4 text-xl font-bold text-accent">مشخصات محصول</h2>
            <dl className="divide-y divide-line">
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3 text-sm leading-7">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-content">{value}</dd>
                </div>
              ))}
            </dl>
          </section>}
          {paragraphs.length > 0 && <section aria-labelledby="description-title" className="rounded-2xl border border-line bg-panel p-5 sm:p-7">
            <h2 id="description-title" className="mb-4 text-xl font-bold text-accent">توضیحات محصول</h2>
            {paragraphs.map((text, index) => <p key={index} className="my-2 leading-8 text-content">{text}</p>)}
          </section>}
        </div>
      )}
      {related.length > 0 && <section className="mt-10" aria-labelledby="related-title">
        <h2 id="related-title" className="mb-5 text-xl font-bold">محصولات مرتبط</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(item =>
          <li key={item.slug}><ProductCard product={item} saveable/></li>
        )}</ul>
      </section>}
    </main>
  );
}
