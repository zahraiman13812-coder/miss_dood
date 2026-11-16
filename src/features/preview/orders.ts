export type PreviewOrder = {
  id: string;
  date: string;
  total: number;
  items: { name: string; quantity: number; amount: number }[];
};
const key = "miss-dood.preview-orders.v1";
export function readPreviews(): PreviewOrder[] {
  try {
    const values: unknown = JSON.parse(sessionStorage.getItem(key) || "[]");
    return Array.isArray(values) ? values.filter(o => o && typeof o.id === "string" && Array.isArray(o.items) && Number.isFinite(o.total)) : [];
  } catch { return []; }
}
export function savePreview(order: PreviewOrder) {
  sessionStorage.setItem(key, JSON.stringify([order, ...readPreviews()].slice(0, 20)));
}
