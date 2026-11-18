import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { storeContact, dialLink } from "@/data/storeContact";

const linkStyle = "block w-fit py-2 text-sm text-muted hover:text-accent";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-accent/45 bg-header text-content">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_1fr_1.5fr] lg:py-12">
        <Link href="/" aria-label="میس دود، صفحه اصلی" className="col-span-2 mx-auto w-fit self-start rounded-md lg:col-span-1 lg:mx-0">
          <Image src="/brand/miss-dood-logo.jpg" width={136} height={136} alt="MISS DOOD" className="size-24 object-contain lg:size-32" />
        </Link>
        <nav aria-label="دسترسی سریع در فوتر">
          <h2 className="mb-2 font-bold text-accent">دسترسی سریع</h2>
          <Link href="/shop" className={linkStyle}>فروشگاه</Link>
          <Link href="/decor" className={linkStyle}>کاتالوگ تزئینی</Link>
          <Link href="/cart" className={linkStyle}>سبد خرید</Link>
          <Link href="/help" className={linkStyle}>راهنمای خرید و پرسش‌های متداول</Link>
        </nav>
        <div className="min-w-0">
          <h2 className="mb-2 font-bold text-accent">ارتباط با میس دود</h2>
          <Link href="/about" className={linkStyle}>دربارهٔ ما</Link>
          <Link href="/contact" className={linkStyle}>تماس با ما</Link>
          {(storeContact.phones.some(Boolean) || storeContact.address) && (
            <address className="mt-3 space-y-3 border-t border-line pt-3 text-sm not-italic text-muted">
              {storeContact.phones.filter(Boolean).map(phone => <a key={phone} href={dialLink(phone)} className="flex w-fit items-center gap-2 hover:text-accent">
                <Phone size={16} aria-hidden="true" className="shrink-0 text-accent" />
                <span dir="ltr">{phone}</span>
              </a>)}
              {storeContact.address && <p className="flex items-start gap-2 leading-7">
                <MapPin size={16} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                <span>{storeContact.address}</span>
              </p>}
            </address>
          )}
        </div>
      </div>
    </footer>
  );
}
