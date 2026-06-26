import Link from "next/link";
import { requirePermission } from "@/lib/auth/helpers";
import { listPayments, getPaymentStats } from "@/lib/actions/admin-payments";
import { PaymentsPanel } from "@/components/admin/PaymentsPanel";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requirePermission("payments", "view");
  const { status } = await searchParams;

  const [listRes, statsRes] = await Promise.all([
    listPayments({ status: status || undefined }),
    getPaymentStats(),
  ]);

  const payments = listRes.ok ? listRes.data : [];
  const stats = statsRes.ok ? statsRes.data : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:text-[#0D2660]">Admin</Link> / Payments
      </nav>
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Payment Reconciliation</h1>
      <p className="text-sm text-gray-500 mb-6">Razorpay admission fee transactions</p>
      <PaymentsPanel payments={payments} stats={stats} statusFilter={status} />
    </div>
  );
}
