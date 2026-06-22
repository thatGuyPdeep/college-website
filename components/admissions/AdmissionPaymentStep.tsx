"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load payment gateway"));
    document.body.appendChild(s);
  });
}

interface Props {
  applicationId: string;
  amount: number;
  keyId: string;
  paid: boolean;
  onPaid: () => void;
}

export function AdmissionPaymentStep({ applicationId, amount, keyId, paid, onPaid }: Props) {
  const [loading, setLoading] = useState(false);

  const startPayment = useCallback(async () => {
    setLoading(true);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ application_id: applicationId }),
      });
      const order = await orderRes.json() as {
        order_id?: string;
        error?: string;
      };
      if (!orderRes.ok || !order.order_id) {
        throw new Error(order.error ?? "Could not start payment");
      }

      await loadRazorpayScript();

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key:         keyId,
          amount:      amount * 100,
          currency:    "INR",
          name:        "Ramakrishna Mission College",
          description: "Admission application fee",
          order_id:    order.order_id,
          prefill:     { email: "", contact: "" },
          theme:       { color: "#0D2660" },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                  application_id:      applicationId,
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature:  response.razorpay_signature,
                }),
              });
              const verify = await verifyRes.json() as { ok?: boolean; error?: string };
              if (!verifyRes.ok || !verify.ok) {
                throw new Error(verify.error ?? "Payment verification failed");
              }
              toast.success("Payment successful");
              onPaid();
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });
        rzp.open();
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg !== "Payment cancelled") toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [applicationId, amount, keyId, onPaid]);

  if (paid) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">
        <CheckCircle className="h-5 w-5 shrink-0" />
        Application fee of ₹{amount} paid. You may submit your application.
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <p className="text-sm text-amber-900">
        Pay the non-refundable application fee of <strong>₹{amount}</strong> before submitting.
      </p>
      <Button
        type="button"
        onClick={() => void startPayment()}
        disabled={loading}
        className="bg-[#0D2660] text-white gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {loading ? "Processing…" : `Pay ₹${amount}`}
      </Button>
    </div>
  );
}
