import Image from "next/image";
import Link from "next/link";
import { productPrice, type Product } from "@/data/mock/latestProducts";
import ProductQuantity from "@/features/cart/ProductQuantity";

import { FavoriteButton } from "./Favorites";
import { categories } from "@/data/navigation";

export default function ProductCard({ product, saveable = false }: { product: Product; saveable?: boolean }) {
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel text-content transition-colors hover:border-accent/70 focus-within:border-accent">
      <div className="relative h-44 shrink-0 min-[25rem]:h-52 bg-radial from-accent/15 via-panel to-header sm:h-60">
        {saveable && <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="rounded-full border border-line bg-header px-3 py-1 text-xs text-muted">{categories.find(([slug]) => slug === product.category)?.[1]}</span>
          <div className="pointer-events-auto"><FavoriteButton slug={product.slug} name={product.name}/></div>
        </div>}
        <Image src={product.image} alt="" fill
          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-3 sm:p-4" />
      </div>
      <div className="flex flex-1 flex-col gap-4 border-t border-line p-4 sm:p-5">
        <h3 className="text-lg font-bold">
          <Link href={'/products/' + product.slug} className="after:absolute after:inset-0 after:rounded-2xl">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto text-start text-lg font-bold tabular-nums text-accent">{productPrice(product.priceToman)}</p>
        <ProductQuantity product={product} />
      </div>
    </article>
  );
}
