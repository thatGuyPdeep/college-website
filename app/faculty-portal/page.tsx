import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, FileText, IndianRupee, ClipboardList } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getFacultyPortalAccess, getFacultyPayrollSummary } from "@/lib/actions/faculty-erp";

export const metadata: Metadata = { title: "Faculty Portal" };

export default async function FacultyPortalPage() {
  const access = await getFacultyPortalAccess();
  if (!access.ok) redirect("/login?redirect=/faculty-portal");

  const payroll = await getFacultyPayrollSummary();
  const { user } = access;

  return (
    <>
      <PageHero
        eyebrow="ERP"
        title="Faculty Portal"
        description={`Welcome${user.name ? `, ${user.name}` : user.email ? `, ${user.email.split("@")[0]}` : ""}.`}
      />
      <section className="section bg-white pt-0">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardContent className="pt-6">
              <ClipboardList className="h-8 w-8 text-[#0D2660] mb-3" />
              <p className="text-sm text-gray-500">Attendance</p>
              <Link href="/faculty-portal/attendance" className="text-lg font-semibold text-[#0D2660] hover:underline">
                Class records
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-[#0D2660] mb-3" />
              <p className="text-sm text-gray-500">Salary</p>
              <Link href="/faculty-portal/salary-slips" className="text-lg font-semibold text-[#0D2660] hover:underline">
                Salary slips
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Calendar className="h-8 w-8 text-[#0D2660] mb-3" />
              <p className="text-sm text-gray-500">Leave</p>
              <Link href="/faculty-portal/leave" className="text-lg font-semibold text-[#0D2660] hover:underline">
                Apply leave
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <IndianRupee className="h-8 w-8 text-[#0D2660] mb-3" />
              <p className="text-sm text-gray-500">Payroll</p>
              <Link href="/faculty-portal/payroll" className="text-lg font-semibold text-[#0D2660] hover:underline">
                Payroll summary
              </Link>
            </CardContent>
          </Card>
        </div>

        {payroll.ok && payroll.payrollNote && (
          <div className="p-5 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-900">
            {payroll.payrollNote}
          </div>
        )}

        {user.role !== "faculty" && (
          <p className="mt-6 text-sm text-gray-500">
            Admin access:{" "}
            <Link href="/admin" className="text-[#C8201A] font-semibold hover:underline">
              Admin dashboard →
            </Link>
          </p>
        )}
      </section>
    </>
  );
}
