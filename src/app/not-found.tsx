import Link from "next/link";
export default function NotFound() {
  return <main className="mx-auto max-w-xl space-y-5 px-5 py-16 text-center">
    <h1 className="text-2xl font-bold">صفحه پیدا نشد</h1>
    <Link href="/shop" className="inline-block rounded-xl bg-accent px-5 py-3 text-on-accent">بازگشت به فروشگاه</Link>
  </main>;
}
