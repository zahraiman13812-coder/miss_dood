"use client";

import { useSyncExternalStore } from "react";
import { readStore } from "@/features/store/store";

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
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      for (const [slug, qty] of Object.entries(saved)) {
        if (/^[a-z0-9][a-z0-9-]{0,119}$/.test(slug) && Number.isSafeInteger(qty) && (qty as number) > 0 && (qty as number) <= 99) items[slug] = qty as number;
      }
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
  if (delta > 0 && (qty > 99 || qty > (readStore().stock[slug] ?? 0))) return;
  if (qty > 0) items[slug] = qty;
  else delete items[slug];
  fallback = JSON.stringify(items);
  try { localStorage.setItem(key, fallback); } catch { /* Keep the session basket in memory. */ }
  window.dispatchEvent(new Event(event));
}

export function currentCart() { return parse(snapshot()); }

export function clearCart() {
 fallback="{}";
 try {localStorage.setItem(key,fallback);} catch { /* In-memory fallback */ }
 window.dispatchEvent(new Event(event));
}
