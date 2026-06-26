"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveOperationalSettings } from "@/lib/actions/admin-settings";
import type { OperationalSettings } from "@/lib/config/operational-settings";

export function OperationalSettingsForm({ initial }: { initial: OperationalSettings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(String(initial.application_fee_inr));
  const [enabled, setEnabled] = useState(initial.payments_enabled);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await saveOperationalSettings({
      application_fee_inr: Number(fee) || 0,
      payments_enabled: enabled,
    });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Operational settings saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-white border border-blue-100 rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[#0D2660]">Admission payments</h2>
        <p className="text-xs text-gray-500 mt-1">
          Overrides env defaults stored in site settings. Razorpay API keys remain in environment variables.
        </p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700" htmlFor="app-fee">Application fee (INR)</label>
        <Input
          id="app-fee"
          type="number"
          min={0}
          step={1}
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="mt-1"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Require online payment during application submit
      </label>
      <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">
        {loading ? "Saving…" : "Save operational settings"}
      </Button>
    </form>
  );
}
