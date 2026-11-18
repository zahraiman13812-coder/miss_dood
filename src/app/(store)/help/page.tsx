import Link from "next/link";
export const metadata = { title: "راهنمای خرید و پرسش‌های متداول | MISS DOOD" };
const questions = [
 ["چطور سفارش ثبت کنم؟", "کالا را به سبد اضافه کنید، شهر ارسال و مشخصات گیرنده را وارد کنید و سفارش را ثبت کنید. برای ثبت نهایی باید به حساب خود وارد شده باشید."],
 ["هزینه ارسال چگونه محاسبه می‌شود؟", "تعرفه شهرهای فعال هنگام انتخاب مقصد در سبد خرید نمایش داده می‌شود. مبلغ نهایی پیش از ثبت قطعی سفارش قابل مشاهده است."],
 ["چگونه سفارش را پیگیری کنم؟", "پس از ورود به حساب، از بخش «پیگیری سفارش» وضعیت سفارش‌های خود را ببینید."],
 ["آیا پرداخت آنلاین فعال است؟", "فعلاً درگاه پرداخت آنلاین فعال نیست. پس از ثبت سفارش برای هماهنگی روش پرداخت با فروشگاه تماس بگیرید. بدون هماهنگی پرداخت نکنید."],
 ["چطور با پشتیبانی ارتباط بگیرم؟", "از صفحه تماس با ما یا بخش پشتیبانی حساب کاربری استفاده کنید. اطلاعات سفارش را بدون ارسال رمز عبور در اختیار پشتیبانی قرار دهید."],
];
export default function HelpPage(){return <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-12"><nav className="mb-4 text-sm text-muted"><Link href="/">خانه</Link> / راهنمای خرید</nav><h1 className="mb-3 text-2xl font-bold sm:text-3xl">راهنمای خرید و پرسش‌های متداول</h1><p className="mb-8 leading-8 text-muted">پاسخ کوتاه به سؤال‌های رایج درباره ثبت، ارسال و پیگیری سفارش.</p><div className="space-y-3">{questions.map(([question,answer])=><details key={question} className="group rounded-2xl border border-line bg-panel p-4 sm:p-5"><summary className="font-semibold leading-7">{question}</summary><p className="mt-3 border-t border-line pt-3 leading-8 text-muted">{answer}</p></details>)}</div><div className="mt-8 flex flex-wrap gap-3"><Link href="/shop" className="rounded-xl bg-accent px-5 py-3 font-bold text-on-accent">مشاهده محصولات</Link><Link href="/contact" className="rounded-xl border border-line px-5 py-3 font-bold">تماس با ما</Link></div></main>}
