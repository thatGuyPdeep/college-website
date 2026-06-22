"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createFeeRecord,
  recordFeePayment,
  type ErpNoticeRow,
  type AttendanceRow,
  type MarkRow,
  type TimetableRow,
  type FeeRow,
} from "@/lib/actions/admin-erp";
import { ERP_DAY_LABELS } from "@/lib/erp/constants";
import type { EnrolledStudent } from "@/lib/actions/admin-erp";

export function ErpRecordsOverview({
  notices,
  attendance,
  marks,
  timetable,
  fees,
  students,
}: {
  notices: ErpNoticeRow[];
  attendance: AttendanceRow[];
  marks: MarkRow[];
  timetable: TimetableRow[];
  fees: FeeRow[];
  students: EnrolledStudent[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feeForm, setFeeForm] = useState({
    user_id: "",
    fee_type: "tuition",
    description: "",
    amount: "",
    due_date: "",
  });
  const [payAmounts, setPayAmounts] = useState<Record<string, string>>({});

  async function addFee(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await createFeeRecord({
      user_id:     feeForm.user_id,
      fee_type:    feeForm.fee_type,
      description: feeForm.description || undefined,
      amount:      Number(feeForm.amount),
      due_date:    feeForm.due_date || undefined,
    });
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Fee record created");
    setFeeForm({ user_id: "", fee_type: "tuition", description: "", amount: "", due_date: "" });
    router.refresh();
  }

  async function payFee(feeId: string) {
    const amt = Number(payAmounts[feeId]);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    setLoading(true);
    const result = await recordFeePayment(feeId, amt);
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Payment recorded");
    router.refresh();
  }

  return (
    <div className="space-y-10 mb-10">
      <section>
        <h3 className="font-semibold text-[#0D2660] mb-3">Recent notices</h3>
        {notices.length === 0 ? (
          <p className="text-sm text-gray-400">No notices published yet.</p>
        ) : (
          <div className="table-responsive bg-white border border-blue-100 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D2660] text-white text-left">
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Audience</th>
                  <th className="px-3 py-2">Published</th>
                </tr>
              </thead>
              <tbody>
                {notices.slice(0, 10).map((n, i) => (
                  <tr key={n.id} className={i % 2 ? "bg-blue-50/30" : ""}>
                    <td className="px-3 py-2">{n.title}</td>
                    <td className="px-3 py-2 capitalize">{n.audience}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{new Date(n.published_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-[#0D2660] mb-3">Recent attendance</h3>
          <div className="table-responsive bg-white border border-blue-100 rounded-xl max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#0D2660] text-white">
                <tr>
                  <th className="px-3 py-2 text-left">Student</th>
                  <th className="px-3 py-2">Course</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, i) => (
                  <tr key={a.id} className={i % 2 ? "bg-blue-50/30" : ""}>
                    <td className="px-3 py-2">{a.student_name ?? "—"}</td>
                    <td className="px-3 py-2">{a.course_code}</td>
                    <td className="px-3 py-2 text-xs">{a.date}</td>
                    <td className="px-3 py-2 capitalize">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-[#0D2660] mb-3">Recent marks</h3>
          <div className="table-responsive bg-white border border-blue-100 rounded-xl max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#0D2660] text-white">
                <tr>
                  <th className="px-3 py-2 text-left">Student</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m, i) => (
                  <tr key={m.id} className={i % 2 ? "bg-blue-50/30" : ""}>
                    <td className="px-3 py-2">{m.student_name ?? "—"}</td>
                    <td className="px-3 py-2">{m.subject}</td>
                    <td className="px-3 py-2">{m.marks_obtained}/{m.max_marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-[#0D2660] mb-3">Timetable slots</h3>
        {timetable.length === 0 ? (
          <p className="text-sm text-gray-400">No timetable slots yet.</p>
        ) : (
          <div className="table-responsive bg-white border border-blue-100 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D2660] text-white text-left">
                  <th className="px-3 py-2">Programme</th>
                  <th className="px-3 py-2">Day</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Room</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((t, i) => (
                  <tr key={t.id} className={i % 2 ? "bg-blue-50/30" : ""}>
                    <td className="px-3 py-2">{t.program_name ?? "—"}</td>
                    <td className="px-3 py-2">{ERP_DAY_LABELS[t.day_of_week] ?? t.day_of_week}</td>
                    <td className="px-3 py-2 text-xs">{t.start_time}–{t.end_time}</td>
                    <td className="px-3 py-2">{t.subject}</td>
                    <td className="px-3 py-2">{t.room ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="font-semibold text-[#0D2660] mb-3">Fee management</h3>
        <form onSubmit={addFee} className="bg-white border border-blue-100 rounded-xl p-5 space-y-3 max-w-lg mb-6">
          <select className="w-full border rounded-md p-2 text-sm" value={feeForm.user_id} required
            onChange={(e) => setFeeForm({ ...feeForm, user_id: e.target.value })}>
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.user_id} value={s.user_id}>{s.full_name ?? s.email}</option>
            ))}
          </select>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Fee type" value={feeForm.fee_type} onChange={(e) => setFeeForm({ ...feeForm, fee_type: e.target.value })} />
            <Input type="number" placeholder="Amount (₹)" value={feeForm.amount} onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })} required />
          </div>
          <Input placeholder="Description" value={feeForm.description} onChange={(e) => setFeeForm({ ...feeForm, description: e.target.value })} />
          <Input type="date" value={feeForm.due_date} onChange={(e) => setFeeForm({ ...feeForm, due_date: e.target.value })} />
          <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Create fee record</Button>
        </form>

        {fees.length === 0 ? (
          <p className="text-sm text-gray-400">No fee records. Run migration 014 if the table is missing.</p>
        ) : (
          <div className="table-responsive bg-white border border-blue-100 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D2660] text-white text-left">
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Paid</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Record payment</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f, i) => (
                  <tr key={f.id} className={i % 2 ? "bg-blue-50/30" : ""}>
                    <td className="px-3 py-2">{f.student_name ?? "—"}</td>
                    <td className="px-3 py-2 capitalize">{f.fee_type}</td>
                    <td className="px-3 py-2">₹{f.amount.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2">₹{f.amount_paid.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2 capitalize">{f.status}</td>
                    <td className="px-3 py-2">
                      {f.status !== "paid" && (
                        <div className="flex gap-1">
                          <Input
                            className="h-8 w-20 text-xs"
                            type="number"
                            placeholder="₹"
                            value={payAmounts[f.id] ?? ""}
                            onChange={(e) => setPayAmounts({ ...payAmounts, [f.id]: e.target.value })}
                          />
                          <Button type="button" size="sm" className="h-8 text-xs" disabled={loading}
                            onClick={() => void payFee(f.id)}>
                            Pay
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
