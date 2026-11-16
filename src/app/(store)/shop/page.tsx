import { categories } from "@/data/navigation";

export default async function ShopPage({ searchParams }: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const selection = categories.find(([slug]) => slug === category);
  const title = selection?.[1] || (q ? "نتایج جست‌وجو" : "فهرست کالاها");
  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-2xl text-accent">{title}</h1>
      {q && <p className="mt-4">{q}</p>}
    </main>
  );
}
