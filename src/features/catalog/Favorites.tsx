"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Heart } from "lucide-react";

const storageKey = "miss-dood.favorites.v1";
const changeEvent = "miss-dood-favorites";
let memory = "[]";
let storageUnavailable = false;
let authenticated = false;
function writeFavorites(values:string[]){
 memory=JSON.stringify(values);try{localStorage.setItem(storageKey,memory);storageUnavailable=false;}catch{storageUnavailable=true;}
 window.dispatchEvent(new Event(changeEvent));
}
function refreshRemote(){fetch("/api/favorites",{cache:"no-store"}).then(async r=>{
 if(r.status===401){authenticated=false;return;}if(!r.ok)throw Error("favorites unavailable");
 const d=await r.json();authenticated=true;writeFavorites(d.favorites);
 }).catch(()=>{});}


function snapshot() {
  try { return storageUnavailable ? memory : localStorage.getItem(storageKey) ?? "[]"; }
  catch { return memory; }
}
function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter(item => typeof item === "string") : [];
  } catch { return []; }
}
function subscribe(refresh: () => void) {
  window.addEventListener(changeEvent, refresh);
  window.addEventListener("storage", refresh);
  return () => {
    window.removeEventListener(changeEvent, refresh);
    window.removeEventListener("storage", refresh);
  };
}
export function useFavorites() {
  useEffect(()=>{refreshRemote();},[]);
  return parse(useSyncExternalStore(subscribe, snapshot, () => "[]"));
}
export function FavoriteButton({ slug, name }: {slug: string; name: string}) {
  const saved = useFavorites().includes(slug);
  async function toggle() {
    const current=parse(snapshot());const nextSaved=!current.includes(slug);
    writeFavorites(nextSaved?[...current,slug]:current.filter(item=>item!==slug));
    if(authenticated){try{const r=await fetch('/api/favorites',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug,saved:nextSaved})});if(!r.ok)throw Error('update failed');}catch{writeFavorites(current);}}
  }
  return <button type="button" onClick={toggle} aria-pressed={saved} aria-label={'علاقه‌مندی · ' + name}
    className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-line bg-header text-accent hover:border-accent">
    <Heart size={19} fill={saved ? "currentColor" : "none"}/>
  </button>;
}
