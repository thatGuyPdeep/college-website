import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { formatSalaryMonth } from "@/lib/utils/salary-format";
import { getFacultyPayrollSummary } from "@/lib/actions/faculty-erp";

export const metadata: Metadata = { title: "Salary Slips" };

export default async function FacultySalarySlipsPage() {
  const payroll = await getFacultyPayrollSummary();
  if (!payroll.ok) redirect("/login?redirect=/faculty-portal/salary-slips");

  return (
    <>
      <PageHero eyebrow="Faculty ERP" title="Salary Slips" description="Download monthly salary statements." />
      <section className="section bg-white pt-0">
        {payroll.salarySlips.length === 0 ? (
          <p className="text-gray-600 text-sm">{payroll.payrollNote}</p>
        ) : (
          <ul className="space-y-3">
            {payroll.salarySlips.map((s) => (
              <li
                key={s.id}
                className="p-4 rounded-xl border border-blue-100 flex flex-wrap justify-between gap-3 items-center"
              >
                <div>
                  <p className="font-semibold text-[#0D2660]">{formatSalaryMonth(s.month, s.year)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Gross ₹{s.grossPay.toLocaleString("en-IN")} · Deductions ₹{s.deductions.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#0D2660]">₹{s.netPay.toLocaleString("en-IN")}</p>
                  {s.filePath && (
                    <Link href={`/api/erp/download?salary_slip_id=${s.id}`} className="text-xs text-[#C8201A] font-semibold hover:underline">
                      Download PDF
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
