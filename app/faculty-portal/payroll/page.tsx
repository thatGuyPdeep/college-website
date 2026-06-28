import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { getFacultyPayrollSummary } from "@/lib/actions/faculty-erp";

export const metadata: Metadata = { title: "Payroll" };

export default async function FacultyPayrollPage() {
  const payroll = await getFacultyPayrollSummary();
  if (!payroll.ok) redirect("/login?redirect=/faculty-portal/payroll");

  return (
    <>
      <PageHero eyebrow="Faculty ERP" title="Payroll" description="Payroll summary and deductions." />
      <section className="section bg-white pt-0">
        <p className="text-gray-600 text-sm leading-relaxed mb-6">{payroll.payrollNote}</p>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl border border-blue-100">
            <dt className="text-gray-500">Employee</dt>
            <dd className="font-semibold text-[#0D2660]">{payroll.user.name ?? payroll.user.email}</dd>
          </div>
          <div className="p-4 rounded-xl border border-blue-100">
            <dt className="text-gray-500">Role</dt>
            <dd className="font-semibold text-[#0D2660] capitalize">{payroll.user.role.replace(/_/g, " ")}</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
