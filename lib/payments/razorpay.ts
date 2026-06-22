import crypto from "crypto";

/** Application fee in INR. Set to 0 to skip payment. */
export const APPLICATION_FEE_INR = Number(process.env.APPLICATION_FEE_INR ?? "0");

export function isPaymentRequired(): boolean {
  return APPLICATION_FEE_INR > 0 && Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder(amountInr: number, receipt: string) {
  const keyId     = process.env.RAZORPAY_KEY_ID!;
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;
  const auth      = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method:  "POST",
    headers: {
      Authorization:  `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount:   amountInr * 100,
      currency: "INR",
      receipt,
      notes:    { purpose: "admission_fee" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Razorpay order failed: ${err}`);
  }
  return res.json() as Promise<{ id: string; amount: number; currency: string }>;
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const body   = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

/** Verify Razorpay webhook payload (X-Razorpay-Signature header). */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}
