import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { formatSalaryMonth } from "@/lib/utils/salary-format";
import { getFacultyPayrollSummary } from "@/lib/actions/faculty-erp";

export const metadata: Metadata = { title: "Payroll" };

export default async function FacultyPayrollPage() {
  const payroll = await getFacultyPayrollSummary();
  if (!payroll.ok) redirect("/login?redirect=/faculty-portal/payroll");

  const latest = payroll.salarySlips[0];
  const ytdNet = payroll.salarySlips.reduce((sum, s) => sum + s.netPay, 0);

  return (
    <>
      <PageHero eyebrow="Faculty ERP" title="Payroll" description="Payroll summary and deductions." />
      <section className="section bg-white pt-0 space-y-8">
        <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-4 rounded-xl border border-blue-100 bg-[#F0F4FF]/50">
            <dt className="text-gray-500">Employee</dt>
            <dd className="font-semibold text-[#0D2660]">{payroll.user.name ?? payroll.user.email}</dd>
          </div>
          <div className="p-4 rounded-xl border border-blue-100">
            <dt className="text-gray-500">Role</dt>
            <dd className="font-semibold text-[#0D2660] capitalize">{payroll.user.role.replace(/_/g, " ")}</dd>
          </div>
          <div className="p-4 rounded-xl border border-blue-100">
            <dt className="text-gray-500">Latest net pay</dt>
            <dd className="font-semibold text-[#0D2660]">
              {latest ? `₹${latest.netPay.toLocaleString("en-IN")}` : "—"}
            </dd>
          </div>
          <div className="p-4 rounded-xl border border-blue-100">
            <dt className="text-gray-500">YTD (published slips)</dt>
            <dd className="font-semibold text-[#0D2660]">
              {payroll.salarySlips.length ? `₹${ytdNet.toLocaleString("en-IN")}` : "—"}
            </dd>
          </div>
        </dl>

        <div>
          <h2 className="text-lg font-semibold text-[#0D2660] mb-3">Leave balance</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-blue-100 text-center">
              <p className="text-2xl font-bold text-[#0D2660]">{payroll.leaveBalance.casual}</p>
              <p className="text-xs text-gray-500">Casual</p>
            </div>
            <div className="p-4 rounded-xl border border-blue-100 text-center">
              <p className="text-2xl font-bold text-[#0D2660]">{payroll.leaveBalance.earned}</p>
              <p className="text-xs text-gray-500">Earned</p>
            </div>
            <div className="p-4 rounded-xl border border-blue-100 text-center">
              <p className="text-2xl font-bold text-[#0D2660]">{payroll.leaveBalance.medical}</p>
              <p className="text-xs text-gray-500">Medical</p>
            </div>
          </div>
        </div>

        {payroll.salarySlips.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#0D2660]">Recent salary slips</h2>
              <Link href="/faculty-portal/salary-slips" className="text-sm text-[#C8201A] font-semibold hover:underline">
                View all →
              </Link>
            </div>
            <ul className="space-y-2">
              {payroll.salarySlips.slice(0, 6).map((s) => (
                <li key={s.id} className="flex justify-between p-3 rounded-lg border border-blue-100 text-sm">
                  <span>{formatSalaryMonth(s.month, s.year)}</span>
                  <span className="font-semibold text-[#0D2660]">₹{s.netPay.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : payroll.payrollNote ? (
          <p className="text-gray-600 text-sm">{payroll.payrollNote}</p>
        ) : null}

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/faculty-portal/salary-slips" className="text-[#C8201A] font-semibold hover:underline">
            Salary slips →
          </Link>
          <Link href="/faculty-portal/leave" className="text-[#C8201A] font-semibold hover:underline">
            Pay leave →
          </Link>
        </div>
      </section>
    </>
  );
}
