# فروشگاه MISS DOOD

پروژهٔ Next.js با TypeScript، Tailwind CSS 4 و رابط فارسی راست‌چین. نسخهٔ فعلی شامل هدر دسکتاپ و موبایل است. صفحات مقصد برای توسعهٔ مرحله‌ای آماده‌اند. داده‌های فروشگاه و اتصال PostgreSQL در مرحله‌های بعد اضافه می‌شوند.

## اجرا روی سیستم خودت

با Node.js 24 LTS، در پوشه‌ای که package.json دارد اجرا کن:

```sh
npm ci
npm run dev
```

سپس http://localhost:3000 را باز کن. برای ساخت نسخهٔ نهایی از npm run build استفاده کن.

## پوشه‌ها

| مسیر | کاربرد |
|---|---|
| public/brand | لوگوی اصلی |
| public/images/products | عکس محصولات |
| src/app/(store) | مسیرهای فروشگاه و چیدمان مشترک |
| src/components/layout/header | هدر و منوی واکنش‌گرا |
| src/components/layout/footer | محل توسعهٔ فوتر |
| src/components/ui | اجزای مشترک رابط |
| src/features/catalog و src/features/cart | منطق کاتالوگ و سبد خرید |
| src/data/navigation.ts | لینک‌های اصلی و دسته‌های کالا |
| src/data/mock | داده‌های نمایشی آینده |
| src/lib/server | محل اتصال آینده به PostgreSQL در سمت سرور |
| src/styles/theme.css | رنگ‌های سراسری Tailwind |

## تغییر رنگ‌ها

در src/styles/theme.css مقدار متغیر موردنظر را زیر @theme تغییر بده. این فایل از globals.css وارد می‌شود. برای مثال، تغییر --color-accent رنگ نوشته‌ها و آیکن‌هایی را که text-accent دارند و پس‌زمینه‌هایی را که bg-accent دارند به‌روز می‌کند.

| نام رنگ | کاربرد |
|---|---|
| page / header / panel | زمینهٔ صفحه، هدر و پنل‌ها |
| content / muted | متن اصلی و فرعی |
| accent / on-accent | تأکید طلایی و نوشتهٔ روی آن |
| line / focus | حاشیه و نشانگر فوکوس |
| overlay | پردهٔ پشت منوی موبایل |

در کامپوننت‌ها از کلاس‌هایی مانند bg-page، text-content، hover:text-accent و border-line استفاده کن. برای معرفی رنگ تازه، یک متغیر با پیشوند --color- به همان فایل اضافه کن. رنگ‌های عکس لوگو در خود تصویر ذخیره شده‌اند.
