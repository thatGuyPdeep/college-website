import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { ENROLLMENT_STEPS } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Examination Enrollment" };

const ENROLLMENT_ITEMS = [
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
      intro="Enrollment is processed at the college examination cell. Online enrollment through the student portal will be available in Phase 2."
      items={ENROLLMENT_ITEMS}
      steps={ENROLLMENT_STEPS}
    />
  );
}
