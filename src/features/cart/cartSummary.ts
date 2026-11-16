import { latestProducts } from "@/data/mock/latestProducts";

export function summarizeCart(cart: Record<string, number>) {
  const lines = latestProducts.filter(product => cart[product.slug] > 0).map(product => {
    const quantity = cart[product.slug];
    return { product, quantity, amount: product.priceToman === null ? null : product.priceToman * quantity };
  });
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce<number | null>((sum, line) =>
    sum === null || line.amount === null ? null : sum + line.amount, 0);
  return { lines, count, total };
}
