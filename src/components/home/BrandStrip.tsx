"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./BrandStrip.module.css";

const brands = [
  ["بهمن", "سیگار ایرانی"],
  ["Marlboro", "سیگار خارجی"],
  ["ایاز", "تنباکوی ایرانی"],
  ["Al Fakher", "تنباکوی خارجی"],
  ["تیر", "سیگار ایرانی"],
  ["Camel", "سیگار خارجی"],
  ["Nakhla", "تنباکوی خارجی"],
];

export default function BrandStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-labelledby="brand-heading" className="mx-auto max-w-7xl px-4 pb-8 sm:px-8">
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <h2 id="brand-heading" className="text-lg font-semibold text-content">از بهمن تا مارلبرو</h2>
          <button type="button" onClick={() => setPaused(!paused)}
            className="grid size-11 place-items-center rounded-full text-accent hover:bg-header motion-reduce:hidden"
            aria-label={paused ? "ادامهٔ حرکت برندها" : "توقف حرکت برندها"}>
            {paused ? <Play size={17}/> : <Pause size={17}/>}
          </button>
        </div>
        <div dir="ltr" className={styles.window}>
          <div className={styles.track} style={{animationPlayState: paused ? "paused" : "running"}}>
            {[0, 1].map(copy => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className={styles.group}>
                {brands.map(([name, type]) => (
                  <li key={name} dir="rtl" className="flex min-w-44 flex-1 items-center justify-center gap-3 border-e border-line px-5 py-5">
                    <span aria-hidden="true" className="size-1.5 rotate-45 bg-accent"/>
                    <div><bdi className="block whitespace-nowrap font-serif text-2xl text-accent">{name}</bdi>
                      <span className="text-xs text-muted">{type}</span></div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
