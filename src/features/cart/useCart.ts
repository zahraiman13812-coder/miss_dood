"use client";

import { useSyncExternalStore } from "react";
import { latestProducts } from "@/data/mock/latestProducts";

const key = "miss-dood.cart.v1";
const event = "miss-dood-cart-updated";
let fallback = "{}";
function snapshot() {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function parse(raw: string): Record<string, number> {
  const items: Record<string, number> = {};
  try {
    const saved = JSON.parse(raw);
    for (const { slug } of latestProducts) {
      if (Number.isSafeInteger(saved?.[slug]) && saved[slug] > 0) items[slug] = saved[slug];
    }
  } catch { /* Start with an empty basket if saved data is unreadable. */ }
  return items;
}
function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(event, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(event, notify);
  };
}
export function useCart() {
  return parse(useSyncExternalStore(subscribe, snapshot, () => "{}"));
}
export function changeQuantity(slug: string, delta: number) {
  const items = parse(snapshot());
  const qty = (items[slug] ?? 0) + delta;
  if (qty > 0) items[slug] = qty;
  else delete items[slug];
  fallback = JSON.stringify(items);
  try { localStorage.setItem(key, fallback); } catch { /* Keep the session basket in memory. */ }
  window.dispatchEvent(new Event(event));
}
