import { decorItems } from "@/data/decor";
import DecorPhoto from "@/features/decor/DecorPhoto";

export default function DecorPage() {
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
    <h1 className="mb-6 text-2xl font-bold">کاتالوگ محصولات تزئینی</h1>
    <ul className="grid justify-center gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),230px))] sm:[grid-template-columns:repeat(auto-fit,minmax(min(100%,304px),304px))]">
      {decorItems.map(item => <li key={item.id} className="aspect-[3/4]"><DecorPhoto item={item}/></li>)}
    </ul>
  </main>;
}
