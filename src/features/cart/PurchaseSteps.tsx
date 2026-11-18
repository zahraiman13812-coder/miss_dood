const steps = ["سبد خرید", "مشخصات گیرنده", "مرور سفارش", "رسید"];
export default function PurchaseSteps({current}: {current: number}) {
  return <ol aria-label="مراحل خرید" className="my-5 grid grid-cols-4 rounded-2xl border border-line bg-panel px-2 py-4">
    {steps.map((label,i) => <li key={label} aria-current={current === i ? "step" : undefined}
      className={`flex flex-col items-center gap-2 text-center text-xs sm:text-sm ${current >= i ? "text-accent" : "text-muted"}`}>
      <span className={`grid size-7 place-items-center rounded-full border ${current >= i ? "border-accent bg-accent text-on-accent" : "border-line"}`}>{(i+1).toLocaleString("fa-IR")}</span>{label}
    </li>)}
  </ol>;
}
