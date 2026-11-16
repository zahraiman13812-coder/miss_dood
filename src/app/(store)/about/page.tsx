import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return <main className="mx-auto w-full max-w-4xl px-5 py-12">
    <article className="grid items-center gap-6 rounded-3xl border border-line bg-panel p-6 sm:grid-cols-[10rem_1fr] sm:p-9">
      <Image src="/brand/miss-dood-logo.jpg" alt="نشان میس دود" width={160} height={160} className="mx-auto rounded-xl"/>
      <div className="space-y-4"><h1 className="text-3xl font-bold text-accent">دربارهٔ میس دود</h1>
        <p className="leading-8">میس دود فروشگاه دخانیات، لوازم جانبی و محصولات تزئینی است. در صفحهٔ هر کالا می‌توانید تصویر، قیمت و مشخصات آن را کنار هم ببینید و مدل‌های مرتبط را بررسی کنید.</p>
        <p className="leading-8">برای پیدا کردن یک مدل از دسته‌بندی‌های فروشگاه شروع کنید. اگر دربارهٔ کالا یا اقلام همراه آن سؤالی دارید، از بخش تماس با ما پیام بگذارید.</p>
        <div className="flex flex-wrap gap-4 text-accent"><Link href="/shop">مشاهده محصولات</Link><Link href="/contact">تماس با ما</Link></div>
      </div>
    </article>
  </main>;
}
