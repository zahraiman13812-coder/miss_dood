export type OrderSubmission = {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingCity: string;
  items: { slug: string; quantity: number }[];
  note?: string;
};
/** This uses the HttpOnly session cookie; never send browser-accessible bearer tokens. */
export async function submitOrder(input: OrderSubmission, requestId = crypto.randomUUID()): Promise<string> {
  const response = await fetch("/api/orders", {
    method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestId },
    credentials: "same-origin", body: JSON.stringify(input),
  });
  const result = await response.json().catch(() => ({})) as { orderId?: string; error?: string };
  if (!response.ok || !result.orderId) throw new Error(result.error ?? "ORDER_FAILED");
  return result.orderId;
}
