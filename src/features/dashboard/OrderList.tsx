import { PackageOpen } from "lucide-react";
import { ShippingAmount } from "@/features/store/Shipping";
import { productPrice } from "@/data/mock/latestProducts";
import { statuses, type PreviewOrder, type OrderStatus } from "@/features/preview/orders";
import { card, number } from "./Panel";

export default function OrderList({orders, change}: {orders:PreviewOrder[]; change?:(id:string,status:OrderStatus)=>void}) {
  if (!orders.length) return <div className={card+" flex items-center gap-4"}><PackageOpen className="shrink-0 text-accent"/><p className="text-sm leading-7 text-muted">سفارشی برای نمایش وجود ندارد.</p></div>;
  return <div className="space-y-3">{orders.map(order => <article className={card} key={order.id}>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-bold">{order.items[0]?.name || "سفارش"}{order.items.length > 1 && ' و ' + number(order.items.length-1) + ' کالای دیگر'}</h3>
      <p className="mt-2 text-sm text-muted">{new Date(order.date).toLocaleDateString("fa-IR")}</p></div>
      <span className="rounded-full border border-accent/40 px-3 py-1.5 text-xs text-accent">{statuses[order.status ?? "received"]}</span></div>
    <details className="mt-4 border-t border-line pt-3"><summary className="text-sm text-accent">جزئیات سفارش · {productPrice(order.total)}</summary>
      <p className="my-3 break-all text-xs text-muted">شناسهٔ سفارش · <bdi>{order.id}</bdi></p>
      {order.shipping && <ShippingAmount rule={order.shipping} subtotal={order.subtotal ?? order.total-order.shipping.fee}/>}
      <ul className="divide-y divide-line">{order.items.map((item,index) => <li key={index} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
        <span>{item.name} × {number(item.quantity)}</span><span>{productPrice(item.amount)}</span></li>)}</ul></details>
    {change && <label className="mt-4 flex flex-wrap items-center gap-3 text-sm">تغییر وضعیت<select value={order.status ?? "received"}
      onChange={e=>change(order.id,e.target.value as OrderStatus)} className="rounded-lg border border-line bg-header p-2">{Object.entries(statuses).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>}
  </article>)}</div>;
}
