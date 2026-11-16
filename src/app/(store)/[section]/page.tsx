import { notFound } from "next/navigation";
import { categories } from "@/data/navigation";
export default async function Destination({ params, searchParams }: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { section } = await params;
  const { category, q } = await searchParams;
  const titles: Record<string,string> = { contact: "تماس با ما", about: "درباره ما", cart: "سبد خرید", login: "ورود کاربر", shop: "فهرست کالاها" };
  if (!Object.hasOwn(titles, section)) notFound();
  const selection = categories.find(([slug]) => slug === category);
  const title = section === "shop" ? selection?.[1] || (q ? "نتایج جست‌وجو" : titles.shop) : titles[section];
  return <main className="mx-auto max-w-7xl px-6 py-14"><h1 className="text-2xl text-accent">{title}</h1>
    {section === "shop" && q && <p className="mt-4">{q}</p>}
    {section === "cart" && <p className="mt-4 text-muted">سبد خرید شما خالی است.</p>}</main>;
}
