import { budgets } from "@/components/home/BudgetLinks";
import { latestProducts } from "@/data/mock/latestProducts";
import { categories } from "@/data/navigation";
import ProductCard from "@/features/catalog/ProductCard";

export default async function ShopPage({ searchParams }: {
  searchParams: Promise<{ category?: string; q?: string; budget?: string }>;
}) {
  const { category, q, budget } = await searchParams;
  const range = budgets.find(b => b.key === budget);
  const query = typeof q === "string" ? q.trim() : "";
  const title = categories.find(([slug]) => slug === category)?.[1] || range?.label || (query ? "نتایج جست‌وجو" : "همه محصولات");
  const products = latestProducts.filter(p => (!category || category === p.category)
    && (!query || p.name.includes(query) || p.description.includes(query))
    && (!range || (p.priceToman !== null && p.priceToman >= range.min && p.priceToman < range.max)));
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      {query && <p className="mb-4 text-muted">{query}</p>}
      {products.length ? <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map(p => <li key={p.slug}><ProductCard product={p} /></li>)}
      </ul> : <p className="text-muted">محصولی برای این انتخاب پیدا نشد.</p>}
    </main>
  );
}
