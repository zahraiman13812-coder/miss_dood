import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { latestProducts, productPrice } from "@/data/mock/latestProducts";
import { categories } from "@/data/navigation";
import ProductCard from "@/features/catalog/ProductCard";
import ProductQuantity from "@/features/cart/ProductQuantity";

const families = [
  ["lighters", "fuel", "gas"],
  ["hookah", "tobacco", "charcoal"],
  ["pods", "e-liquid", "nic-salt"],
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = latestProducts.find(item => item.slug === slug);
  if (!product) notFound();

  const categoryName = categories.find(([key]) => key === product.category)?.[1];
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
        <div className="relative isolate grid h-72 place-items-center bg-radial from-accent/15 via-header to-page sm:h-96 md:h-full md:min-h-96">
          <span aria-hidden="true" className="absolute aspect-square h-3/4 rounded-full border border-accent/15"/>
          <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 1152px) 544px, (min-width: 768px) 48vw, 95vw" className="object-contain p-7 sm:p-10"/>
        </div>
        <div className="flex flex-col justify-center gap-4 p-5 sm:p-9">
          <h1 className="text-2xl font-bold text-content sm:text-4xl">{product.name}</h1>
          <p className="leading-8 text-muted">{product.description}</p>
          <div className="mt-3 space-y-4 border-t border-line pt-5">
            <p className="text-2xl font-bold tabular-nums text-accent">{productPrice(product.priceToman)}</p>
            <ProductQuantity product={product}/>
          </div>
        </div>
      </article>
      {related.length > 0 && <section className="mt-10" aria-labelledby="related-title">
        <h2 id="related-title" className="mb-5 text-xl font-bold">محصولات مرتبط</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(item =>
          <li key={item.slug}><ProductCard product={item}/></li>
        )}</ul>
      </section>}
    </main>
  );
}
