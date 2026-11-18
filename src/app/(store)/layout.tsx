import type { ReactNode } from "react";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";

export default function Store({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-header focus:p-3 focus:text-accent">رفتن به محتوای اصلی</a>
      <Header />
      <div id="main-content" className="flex min-w-0 flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
