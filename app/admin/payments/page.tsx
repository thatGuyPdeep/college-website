import Link from "next/link";
import { requireRole } from "@/lib/auth/helpers";
import { listPayments } from "@/lib/actions/admin-payments";

export default async function AdminPaymentsPage() {
  await requireRole(["admissions_staff", "admin", "super_admin"]);
  const result = await listPayments();
  const payments = result.ok ? result.data : [];

  const paid = payments.filter((p) => p.status === "paid").length;
  const pending = payments.filter((p) => p.status === "created").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:text-[#0D2660]">Admin</Link> / Payments
      </nav>
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Payment Reconciliation</h1>
      <p className="text-sm text-gray-500 mb-6">{paid} paid · {pending} pending</p>

      {payments.length === 0 ? (
        <p className="text-sm text-gray-400">No payment records yet.</p>
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
                  <td className="px-4 py-2 capitalize">{p.status}</td>
                  <td className="px-4 py-2 text-xs font-mono truncate max-w-[8rem]">
                    {p.razorpay_payment_id ?? p.razorpay_order_id ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
