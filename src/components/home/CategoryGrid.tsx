import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/navigation";

export default function CategoryGrid() {
  return (
    <section aria-labelledby="category-heading" className="mx-auto max-w-7xl px-4 pb-12 sm:px-8">
      <div className="mb-5 flex items-center gap-4">
        <h2 id="category-heading" className="text-xl font-bold text-content sm:text-2xl">دسته‌بندی کالاها</h2>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>
      <ul className="grid grid-cols-5 gap-x-2 gap-y-5 lg:grid-cols-10">
        {categories.map(([slug, label]) => (
          <li key={slug}>
            <Link href={{ pathname: "/shop", query: { category: slug } }}
              className="group flex flex-col items-center gap-2 rounded-lg text-center">
              <div className="relative aspect-square w-full max-w-20 rounded-full border border-line bg-panel group-hover:border-accent">
                <Image src={`/images/categories/${slug}.webp`} alt="" fill
                  sizes="(min-width: 640px) 160px, 35vw"
                  className="object-contain p-2.5 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105" />
              </div>
              <span className="text-sm font-semibold text-content group-hover:text-accent">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
