import Link from "next/link";

export const budgets = [
  { key: "under-200k", label: "کمتر از ۲۰۰ هزار تومان", min: 0, max: 200000 },
  { key: "200k-to-1m", label: "۲۰۰ هزار تا یک میلیون تومان", min: 200000, max: 1000000 },
  { key: "from-1m", label: "از یک میلیون تومان", min: 1000000, max: Infinity },
];

export default function BudgetLinks() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-8" aria-labelledby="budget-title">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-panel p-4">
        <h2 id="budget-title" className="me-auto font-bold">انتخاب بر اساس بودجه</h2>
        {budgets.map(b => <Link key={b.key} href={'/shop?budget=' + b.key}
          className="rounded-full border border-line px-4 py-3 text-sm hover:border-accent hover:text-accent">{b.label}</Link>)}
      </div>
    </section>
  );
}
