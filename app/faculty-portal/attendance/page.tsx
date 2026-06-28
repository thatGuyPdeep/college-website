import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { FacultyAttendancePanel } from "@/components/faculty/FacultyAttendancePanel";
import { getFacultyAttendanceData } from "@/lib/actions/faculty-erp";

export const metadata: Metadata = { title: "Faculty Attendance" };

export default async function FacultyAttendancePage() {
  const data = await getFacultyAttendanceData();
  if (!data.ok) redirect("/login?redirect=/faculty-portal/attendance");

  return (
    <>
      <PageHero eyebrow="Faculty ERP" title="Attendance" description="Timetable and student attendance marking." />
      <section className="section bg-white pt-0">
        <FacultyAttendancePanel
          displayName={data.displayName}
          timetable={data.timetable}
          summaries={data.summaries}
          hasClasses={data.hasClasses}
        />
      </section>
    </>
  );
}
