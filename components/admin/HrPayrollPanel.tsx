"use client";

import { useTransition } from "react";
import {
  createSalarySlip,
  setLeaveBalance,
  updateLeaveRequestStatus,
} from "@/lib/actions/faculty-erp";

type LeaveRow = {
  id: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: number;
  status: string;
  profiles?: { email?: string; full_name?: string } | null;
};

export function HrPayrollPanel({ pendingLeaves }: { pendingLeaves: LeaveRow[] }) {
  const [pending, startTransition] = useTransition();

  function action(fn: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) alert(res.error ?? "Action failed");
    });
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Pending leave requests</h2>
        {pendingLeaves.length === 0 ? (
          <p className="text-sm text-gray-500">No pending leave applications.</p>
        ) : (
          <ul className="space-y-3">
            {pendingLeaves.map((l) => (
              <li key={l.id} className="p-4 rounded-xl border border-blue-100 bg-white text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#0D2660]">
                      {l.profiles?.full_name ?? l.profiles?.email ?? "Staff"}
                    </p>
                    <p className="text-gray-500 capitalize">
                      {l.leave_type} · {l.from_date} → {l.to_date} ({l.days} days)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => action(() => updateLeaveRequestStatus(l.id, "approved"))}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => action(() => updateLeaveRequestStatus(l.id, "rejected"))}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Publish salary slip</h2>
          <form
            action={(fd) => startTransition(async () => {
              const res = await createSalarySlip(fd);
              if (!res.ok) alert(res.error);
            })}
            className="space-y-3 text-sm"
          >
            <input name="email" type="email" placeholder="Faculty email" required className="w-full border rounded-lg px-3 py-2" />
            <div className="grid grid-cols-2 gap-3">
              <input name="month" type="number" min={1} max={12} placeholder="Month (1–12)" required className="border rounded-lg px-3 py-2" />
              <input name="year" type="number" min={2020} placeholder="Year" required className="border rounded-lg px-3 py-2" />
            </div>
            <input name="gross_pay" type="number" step="0.01" placeholder="Gross pay (₹)" required className="w-full border rounded-lg px-3 py-2" />
            <input name="deductions" type="number" step="0.01" placeholder="Deductions (₹)" className="w-full border rounded-lg px-3 py-2" />
            <input name="net_pay" type="number" step="0.01" placeholder="Net pay (optional)" className="w-full border rounded-lg px-3 py-2" />
            <label className="block">
              <span className="text-xs text-gray-500 mb-1 block">Salary slip PDF (optional, max 5 MB)</span>
              <input name="pdf" type="file" accept="application/pdf" className="w-full text-sm" />
            </label>
            <button type="submit" disabled={pending} className="px-4 py-2 bg-[#0D2660] text-white font-semibold rounded-lg">
              Publish slip
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Set leave balance</h2>
          <form
            action={(fd) => startTransition(async () => {
              const res = await setLeaveBalance(fd);
              if (!res.ok) alert(res.error);
            })}
            className="space-y-3 text-sm"
          >
            <input name="email" type="email" placeholder="Faculty email" required className="w-full border rounded-lg px-3 py-2" />
            <div className="grid grid-cols-3 gap-3">
              <input name="casual" type="number" placeholder="Casual" defaultValue={12} className="border rounded-lg px-3 py-2" />
              <input name="earned" type="number" placeholder="Earned" defaultValue={30} className="border rounded-lg px-3 py-2" />
              <input name="medical" type="number" placeholder="Medical" defaultValue={15} className="border rounded-lg px-3 py-2" />
            </div>
            <button type="submit" disabled={pending} className="px-4 py-2 bg-[#0D2660] text-white font-semibold rounded-lg">
              Update balance
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
