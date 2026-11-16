import Header from "@/components/layout/header/Header";
import type { ReactNode } from "react";
export default function Store({ children }: { children: ReactNode }) {
  return <><Header />{children}</>;
}
