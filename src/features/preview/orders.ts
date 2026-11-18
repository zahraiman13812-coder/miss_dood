import { readStore, updateStore, type ShippingRule } from "../store/store";
export const statuses = { received: "ثبت شده", packing: "در حال آماده‌سازی", sent: "ارسال شده" } as const;
export type OrderStatus = keyof typeof statuses;
export type PreviewOrder = {
  id: string;
  date: string;
  shipping?: ShippingRule;
  subtotal?: number;
  status?: OrderStatus;
  total: number;
  items: { name: string; quantity: number; amount: number }[];
};
export function readPreviews(): PreviewOrder[] { return readStore().orders; }
export function savePreview(order: PreviewOrder) {
  updateStore(s=>({...s,orders:[order,...s.orders].slice(0,20)}));
}
export function changePreviewStatus(id:string,status:OrderStatus) {
  updateStore(s=>{
    if (!s.orders.some(o=>o.id === id)) throw new Error("Order unavailable");
    return {...s,orders:s.orders.map(o=>o.id===id ? {...o,status} : o)};
  });
  return readPreviews();
}
