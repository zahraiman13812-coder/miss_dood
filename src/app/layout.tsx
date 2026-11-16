import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title: "MISS DOOD | میس دود" };
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="fa" dir="rtl"><body className="min-h-dvh bg-page text-content">{children}</body></html>;
}
