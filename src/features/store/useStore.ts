"use client";
import { useEffect, useSyncExternalStore } from "react";
import { initial, readStore, subscribeStore, updateStore } from "./store";

type Status = "loading" | "ready" | "error";
let status: Status = "loading";
let latestFetch = 0;
let inflight: Promise<void> | undefined;
const statusEvent = "miss-dood-catalog-status";
const subscribeStatus = (listener: () => void) => { window.addEventListener(statusEvent, listener); return () => window.removeEventListener(statusEvent, listener); };
const getStatus = () => status;
const serverStatus = (): Status => "loading";
function setStatus(next: Status) { status = next; if(typeof window !== "undefined") window.dispatchEvent(new Event(statusEvent)); }
export function refreshCatalog(force=false): Promise<void> {
 if (inflight) return inflight;
 if (!force && status === "ready" && Date.now()-latestFetch < 30_000) return Promise.resolve();
 setStatus("loading");
 inflight = fetch("/api/catalog", {cache:"no-store"}).then(async res => {
  if(!res.ok) throw Error("CATALOG_UNAVAILABLE");
  const data = await res.json();
  if(!Array.isArray(data.products) || !data.stock || !Array.isArray(data.shipping)) throw Error("INVALID_CATALOG");
  updateStore(s => ({...s, products:data.products, stock:data.stock, shipping:data.shipping}));
  latestFetch=Date.now(); setStatus("ready");
 }).catch(() => { setStatus("error"); }).finally(() => {inflight=undefined;});
 return inflight;
}
export function useStore() {
 useEffect(() => {void refreshCatalog();}, []);
 const store = useSyncExternalStore(subscribeStore, readStore, () => initial);
 const catalogStatus = useSyncExternalStore(subscribeStatus, getStatus, serverStatus);
 return {...store, catalogStatus};
}
