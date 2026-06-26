"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportPaymentsCsv } from "@/lib/actions/admin-payments";
import type { PaymentRow, PaymentStats } from "@/lib/actions/admin-payments";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "created" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export function PaymentsPanel({
  payments,
  stats,
  statusFilter,
}: {
  payments: PaymentRow[];
  stats: PaymentStats | null;
  statusFilter?: string;
}) {
  const [pending, startTransition] = useTransition();

  function filterHref(status: string) {
    return status ? `/admin/payments?status=${status}` : "/admin/payments";
  }

  async function handleExport() {
    startTransition(async () => {
      const res = await exportPaymentsCsv();
      if (!res.ok) { toast.error(res.error); return; }
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Payments exported");
    });
  }

  return (
    <>
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total },
            { label: "Paid", value: stats.paid },
            { label: "Pending", value: stats.pending },
            { label: "Failed", value: stats.failed },
            { label: "Refunded", value: stats.refunded },
            { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}` },
            { label: "Paid today", value: stats.todayPaid },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-xl font-bold text-[#0D2660]">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.label}
              href={filterHref(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                (statusFilter ?? "") === tab.value
                  ? "bg-[#0D2660] text-white border-[#0D2660]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0D2660]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <Button variant="outline" size="sm" disabled={pending} onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      {stats && stats.failed > 0 && (
        <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{stats.failed} failed payment(s) need reconciliation.</span>
        </div>
      )}

      {payments.length === 0 ? (
        <p className="text-sm text-gray-400">No payment records for this filter.</p>
      ) : (
        <div className="table-responsive bg-white border border-blue-100 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0D2660] text-white text-left">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Application</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Razorpay ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id} className={i % 2 ? "bg-blue-50/30" : ""}>
                  <td className="px-4 py-2 text-xs">{new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{p.application_no ?? "—"}</div>
                    <div className="text-xs text-gray-400">{p.applicant_email}</div>
                  </td>
                  <td className="px-4 py-2">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-2 capitalize">
                    <span className={
                      p.status === "paid" ? "text-green-700" :
                      p.status === "failed" ? "text-red-700" :
                      p.status === "created" ? "text-amber-700" : ""
                    }>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs font-mono truncate max-w-[8rem]">
                    {p.razorpay_payment_id ?? p.razorpay_order_id ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
