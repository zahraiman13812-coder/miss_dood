import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { latestProducts, productPrice } from "@/data/mock/latestProducts";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = latestProducts.find(item => item.slug === slug);
  if (!product) notFound();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/#latest-title" className="text-accent">بازگشت به تازه‌ها</Link>
      <article className="mt-5 grid items-center gap-8 rounded-2xl border border-line bg-panel p-6 sm:grid-cols-2">
        <Image width={400} height={400} src={product.image} alt={product.name} className="h-64 w-full object-contain"/>
        <div><h1 className="text-2xl font-bold text-content">{product.name}</h1>
          <p className="my-4 text-muted">{product.description}</p>
          <p className="text-accent">{productPrice(product.priceToman)}</p>
        </div>
      </article>
    </main>
  );
}
