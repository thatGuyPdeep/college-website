"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface Props {
  applicationId: string;
  amount: number;
  keyId: string;
  applicantEmail: string;
  applicantName: string;
  onPaid: () => void;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

export function PaymentButton({ applicationId, amount, keyId, applicantEmail, applicantName, onPaid }: Props) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid]         = useState(false);

  async function pay() {
    setLoading(true);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ application_id: applicationId }),
      });
      const orderData = await orderRes.json() as {
        order_id?: string; amount?: number; key_id?: string; error?: string;
      };
      if (!orderRes.ok) throw new Error(orderData.error ?? "Could not start payment");

      await loadRazorpayScript();

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key:         orderData.key_id ?? keyId,
          amount:      (orderData.amount ?? amount) * 100,
          currency:    "INR",
          name:        "RKM Vivekananda College Narayanpur",
          description: "Admission Application Fee",
          order_id:    orderData.order_id,
          prefill:     { email: applicantEmail, name: applicantName },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
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
            if (!verifyRes.ok) {
              const v = await verifyRes.json() as { error?: string };
              reject(new Error(v.error ?? "Payment verification failed"));
              return;
            }
            setPaid(true);
            onPaid();
            toast.success("Payment successful!");
            resolve();
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });
        rzp.open();
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  if (paid) {
    return (
      <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 font-medium">
        Application fee paid (₹{amount})
      </div>
    );
  }

  return (
    <Button type="button" onClick={pay} disabled={loading}
      className="w-full bg-[#0D2660] hover:bg-[#071540] text-white">
      {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processing…</> : `Pay Application Fee — ₹${amount}`}
    </Button>
  );
}
