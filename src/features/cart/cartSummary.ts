import { readStore } from "@/features/store/store";

export function summarizeCart(cart: Record<string, number>) {
  const {products,stock}=readStore();
  const lines = products.filter(product => cart[product.slug] > 0).map(product => {
    const quantity = cart[product.slug];
    return { product, quantity, amount: product.priceToman === null ? null : product.priceToman * quantity };
  });
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce<number | null>((sum, line) =>
    sum === null || line.amount === null ? null : sum + line.amount, 0);
  const stockIssue = lines.some(l=>l.quantity > (stock[l.product.slug] ?? 0));
  return { lines, count, total, stockIssue };
}
