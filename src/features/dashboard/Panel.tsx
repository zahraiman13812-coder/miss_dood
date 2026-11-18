import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpLeft, LayoutDashboard, type LucideIcon } from "lucide-react";

export const card = "min-w-0 rounded-2xl border border-line bg-panel p-5 sm:p-6";
export const input = "mt-2 block min-w-0 max-w-full w-full rounded-xl border border-line bg-header px-4 py-3 text-content";
export const primary = "rounded-xl bg-accent px-5 py-3 font-bold text-on-accent hover:brightness-110";
export const number = (n: number) => n.toLocaleString("fa-IR");

export function Panel<T extends string>({title, subtitle, tabs, active, select, children, footer}: {
  title: string; subtitle: string; tabs: readonly {id:T; label:string; icon:LucideIcon}[];
  active:T; select:(id:T)=>void; children:ReactNode; footer?:ReactNode;
}) {
  const heading = tabs.find(tab => tab.id === active)?.label;
  return <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 lg:py-9">
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="min-w-0 overflow-hidden rounded-2xl border border-line bg-panel lg:sticky lg:top-32">
        <div className="border-b border-line bg-linear-to-bl from-accent/15 to-panel p-5">
          <LayoutDashboard className="mb-3 text-accent" size={24}/><h1 className="text-xl font-bold">{title}</h1>
          <p className="mt-2 break-words text-sm leading-6 text-muted">{subtitle}</p>
        </div>
        <label className="block px-4 py-3 text-sm sm:hidden">بخش پنل<select className={input} value={active} onChange={e=>select(e.target.value as T)}>{tabs.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></label>
        <nav aria-label={title} className="hidden gap-1 p-2 sm:grid sm:grid-cols-3 lg:flex lg:flex-col">{tabs.map(({id,label,icon:Icon}) =>
          <button type="button" key={id} onClick={()=>select(id)} aria-current={active === id ? "page" : undefined}
            className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm text-muted hover:bg-header aria-[current=page]:bg-accent/15 aria-[current=page]:font-bold aria-[current=page]:text-accent">
            <Icon size={17}/>{label}</button>)}</nav>
        {footer && <div className="flex flex-wrap items-center gap-4 border-t border-line px-5 py-3 text-sm text-accent">{footer}</div>}
      </aside>
      <div className="min-w-0 space-y-5">
        <header className="flex items-center justify-between gap-3 border-b border-line pb-4"><h2 className="text-2xl font-bold">{heading}</h2>
          <Link href="/shop" className="flex items-center gap-1 text-sm text-accent">فروشگاه<ArrowUpLeft size={16}/></Link></header>
        {children}
      </div>
    </div>
  </main>;
}
export function Metrics({items}: {items:{label:string; value:string; icon:LucideIcon}[]}) {
  return <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">{items.map(({label,value,icon:Icon}) =>
    <div key={label} className="rounded-2xl border border-line bg-linear-to-bl from-panel to-header p-4 last:col-span-2 sm:last:col-span-1">
      <Icon size={19} className="mb-4 text-accent"/><dt className="text-sm text-muted">{label}</dt><dd className="mt-2 font-bold tabular-nums sm:text-xl">{value}</dd>
    </div>)}</dl>;
}
