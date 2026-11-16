"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./DecorDeck.module.css";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { decorItems } from "@/data/decor";
import DecorPhoto from "./DecorPhoto";

const button = "grid size-11 place-items-center rounded-full border border-line text-accent hover:border-accent";
export default function DecorDeck() {
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<{ index: number; step: number } | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const count = decorItems.length;
  if (!count) return null;
  function move(step: number) {
    if (count < 2 || outgoing) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutgoing({ index: active, step });
    }
    setActive((active + step + count) % count);
  }

  return (
    <section aria-labelledby="decor-title" className="mx-auto max-w-7xl px-4 pb-12 sm:px-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="decor-title" className="text-xl font-bold sm:text-2xl">کاتالوگ محصولات تزئینی</h2>
        <Link href="/shop?category=decor" className="shrink-0 rounded-full border border-line px-4 py-2 text-sm text-accent hover:border-accent">مشاهده همه</Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-header px-7 pb-4 pt-6 sm:pt-8">
        <div className="relative isolate mx-auto aspect-[3/4] w-[230px] max-w-[85%] touch-pan-y sm:w-[304px]"
          onPointerDown={e => {
            if (!e.isPrimary || e.button !== 0) return;
            start.current = { x: e.clientX, y: e.clientY };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerCancel={() => { start.current = null; }}
          onPointerUp={e => {
            if (!start.current || !e.isPrimary) return;
            const dx = e.clientX - start.current.x;
            const dy = e.clientY - start.current.y;
            start.current = null;
            if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1);
          }}>
          {decorItems.map((item, index) => {
            const ahead = (index - active + count) % count;
            const slot = ahead > count / 2 ? ahead - count : ahead;
            const depth = Math.abs(slot);
            if (depth > 3) return null;
            const leaving = outgoing?.index === index;
            const position = `translateX(${-slot * 8}%) translateY(${depth * 1.4}%) rotate(${-slot * 3}deg) scale(${1 - depth * 0.06})`;
            const style = {
              zIndex: 7 - depth,
              transform: position,
              "--landing": position,
              "--sweep": outgoing?.step === -1 ? "-27%" : "27%",
              "--tilt": outgoing?.step === -1 ? "-9deg" : "9deg",
            } as CSSProperties;
            return (
              <div key={item.id} aria-hidden={depth !== 0} style={style}
                className={`absolute inset-0 motion-safe:transition-transform motion-safe:duration-300 ${leaving ? styles.leaving : ""}`}
                onAnimationEnd={leaving ? () => setOutgoing(null) : undefined}>
                <DecorPhoto item={item}/>
              </div>
            );
          })}
        </div>
        {count > 1 && <div className="mt-5 flex items-center justify-center gap-4">
          <button type="button" className={button} aria-label="تصویر قبلی" onClick={() => move(-1)}><ChevronRight size={18}/></button>
          <span aria-live="polite" className="text-sm text-muted">{(active+1).toLocaleString("fa-IR")} از {count.toLocaleString("fa-IR")}</span>
          <button type="button" className={button} aria-label="تصویر بعدی" onClick={() => move(1)}><ChevronLeft size={18}/></button>
        </div>}
      </div>
    </section>
  );
}
