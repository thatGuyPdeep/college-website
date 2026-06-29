import type { Metadata } from "next";
import Link from "next/link";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { ENROLLMENT_STEPS } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Examination Enrollment" };

const ENROLLMENT_ITEMS = [
  {
    title: "Student portal — view attendance & marks",
    href: "/login?redirect=/student",
    note: "Log in with your college email OTP to access the student ERP.",
  },
  {
    title: "Semester enrollment form — collect from examination cell",
    date: "Jul 2026",
    href: "/contact?subject=Semester%20Enrollment",
    note: "Required before examination form submission.",
  },
  {
    title: "Fee payment — accounts section",
    href: "/admissions/fees",
    note: "Clear semester fees before enrollment is accepted.",
  },
  {
    title: "Downloadable forms",
    href: "/forms",
  },
];

export default function ExaminationEnrollmentPage() {
  return (
    <ExaminationListingPage
      title="Online Enrollment (Regular)"
      hindiTitle="नामांकन"
      description="Semester enrollment for regular UG (FYUGP) students."
      intro={
        <>
          Enrollment is processed at the college examination cell. Enrolled students can{" "}
          <Link href="/login?redirect=/student" className="text-[#C8201A] font-semibold hover:underline">
            sign in to the student portal
          </Link>{" "}
          to view attendance, marks, and timetable while offline enrollment forms are submitted at the office.
        </>
      }
      items={ENROLLMENT_ITEMS}
      steps={ENROLLMENT_STEPS}
    />
  );
}
