"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  { file: "miss-dood-1", alt: "بنر اول مجموعهٔ مشکی‌طلایی میس دود" },
  { file: "miss-dood-2", alt: "بنر دوم مجموعهٔ مشکی‌طلایی میس دود" },
  { file: "miss-dood-3", alt: "بنر سوم مجموعهٔ مشکی‌طلایی میس دود" },
];
const button = "grid size-11 place-items-center rounded-full hover:bg-panel hover:text-accent";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPlaying(!motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(i => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing]);

  function move(step: number) {
    setPlaying(false);
    setIndex(i => (i + step + slides.length) % slides.length);
  }

  return (
    <section aria-label="بنرهای میس دود" className="mx-auto max-w-7xl px-4 py-5 sm:px-8 sm:py-8">
      <div className="relative isolate aspect-video lg:aspect-auto lg:h-[clamp(280px,30vw,380px)] overflow-hidden rounded-2xl border border-line bg-header">
        {slides.map((slide, i) => (
          <Image key={slide.file} src={`/images/hero/${slide.file}.webp`}
            alt={slide.alt} fill priority={i === 0} aria-hidden={index !== i}
            sizes="(min-width: 1280px) 1216px, 100vw"
            className={`object-cover object-[center_35%] transition-opacity duration-700 motion-reduce:transition-none ${index === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute bottom-3 start-3 flex items-center rounded-full border border-line bg-header/95 px-1 text-content">
          <button type="button" className={button} aria-label="بنر قبلی" onClick={() => move(-1)}><ChevronRight size={18}/></button>
          <span className="min-w-10 text-center text-sm text-accent" dir="ltr" aria-live={playing ? "off" : "polite"}>
            {(index + 1).toLocaleString("fa-IR")} / {slides.length.toLocaleString("fa-IR")}
          </span>
          <button type="button" className={button} aria-label="بنر بعدی" onClick={() => move(1)}><ChevronLeft size={18}/></button>
          <button type="button" className={button} aria-label={playing ? "توقف پخش" : "شروع پخش"} onClick={() => setPlaying(p => !p)}>
            {playing ? <Pause size={16}/> : <Play size={16}/>}
          </button>
        </div>
      </div>
    </section>
  );
}
