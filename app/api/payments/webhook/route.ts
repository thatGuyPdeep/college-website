import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { markPaymentPaid } from "@/lib/payments/complete-payment";

type RazorpayWebhook = {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
  };
};

export async function POST(req: NextRequest) {
  try {
    const rawBody   = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody) as RazorpayWebhook;

    if (body.event !== "payment.captured") {
      return NextResponse.json({ ok: true, skipped: body.event });
    }

    const payment = body.payload?.payment?.entity;
    const orderId   = payment?.order_id;
    const paymentId = payment?.id;

    if (!orderId || !paymentId) {
      return NextResponse.json({ error: "Missing payment data" }, { status: 400 });
    }

    const result = await markPaymentPaid(orderId, paymentId);
    if (!result.ok) {
      console.error("[payments/webhook]", result.error);
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ ok: true, alreadyPaid: result.alreadyPaid ?? false });
  } catch (err) {
    console.error("[payments/webhook]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
