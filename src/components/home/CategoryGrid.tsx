import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { categories } from "@/data/navigation";

export default function CategoryGrid() {
  return (
    <section aria-labelledby="category-heading" className="mx-auto max-w-7xl px-4 pb-12 sm:px-8">
      <div className="mb-5 flex items-center gap-4">
        <h2 id="category-heading" className="text-xl font-bold text-content sm:text-2xl">دسته‌بندی کالاها</h2>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {categories.map(([slug, label]) => (
          <li key={slug}>
            <Link href={{ pathname: "/shop", query: { category: slug } }}
              className="group block rounded-2xl border border-line bg-linear-to-b from-panel to-header p-3 hover:border-accent focus-visible:border-accent sm:p-4">
              <div className="relative mx-auto aspect-square w-4/5 max-w-40">
                <Image src={`/images/categories/${slug}.webp`} alt="" fill
                  sizes="(min-width: 640px) 160px, 35vw"
                  className="object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105" />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <span className="font-semibold text-content group-hover:text-accent">{label}</span>
                <ArrowUpLeft size={17} aria-hidden="true" className="text-accent" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
