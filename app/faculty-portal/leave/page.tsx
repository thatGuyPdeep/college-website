import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { LeaveApplicationForm } from "@/components/faculty/LeaveApplicationForm";
import { getFacultyPayrollSummary } from "@/lib/actions/faculty-erp";

export const metadata: Metadata = { title: "Pay Leave" };

export default async function FacultyLeavePage() {
  const payroll = await getFacultyPayrollSummary();
  if (!payroll.ok) redirect("/login?redirect=/faculty-portal/leave");

  const bal = payroll.leaveBalance;

  return (
    <>
      <PageHero eyebrow="Faculty ERP" title="Pay Leave" description="Leave balance and application." />
      <section className="section bg-white pt-0 space-y-10">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-blue-100 bg-[#F0F4FF] text-center">
            <p className="text-2xl font-bold text-[#0D2660]">{bal.casual}</p>
            <p className="text-xs text-gray-500 mt-1">Casual Leave</p>
          </div>
          <div className="p-4 rounded-xl border border-blue-100 bg-[#F0F4FF] text-center">
            <p className="text-2xl font-bold text-[#0D2660]">{bal.earned}</p>
            <p className="text-xs text-gray-500 mt-1">Earned Leave</p>
          </div>
          <div className="p-4 rounded-xl border border-blue-100 bg-[#F0F4FF] text-center">
            <p className="text-2xl font-bold text-[#0D2660]">{bal.medical}</p>
            <p className="text-xs text-gray-500 mt-1">Medical Leave</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Apply for leave</h2>
          <LeaveApplicationForm />
        </div>

        {payroll.leaveRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Your applications</h2>
            <ul className="space-y-3">
              {payroll.leaveRequests.map((l) => (
                <li key={l.id} className="p-4 rounded-xl border border-blue-100 text-sm">
                  <span className="font-semibold capitalize text-[#0D2660]">{l.leaveType}</span>
                  {" · "}
                  {l.fromDate} → {l.toDate} ({l.days} days)
                  <span
                    className={`ml-2 text-xs font-semibold uppercase ${
                      l.status === "approved"
                        ? "text-green-700"
                        : l.status === "rejected"
                          ? "text-red-600"
                          : "text-amber-700"
                    }`}
                  >
                    {l.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {payroll.payrollNote && (
          <p className="text-gray-600 text-sm">{payroll.payrollNote}</p>
        )}
      </section>
    </>
  );
}
