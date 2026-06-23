import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { ADMIT_CARD_STEPS } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Admit Card" };

const ADMIT_CARD_ITEMS = [
  {
    title: "Admit card issue — Odd Semester examinations",
    date: "Nov 2026",
    href: "/examination/notices",
    note: "Collect from examination cell after enrollment clearance.",
  },
  {
    title: "Admit card issue — Even Semester examinations",
    date: "May 2027",
    href: "/examination/notices",
  },
  {
    title: "Enrollment status check",
    href: "/examination/enrollment",
  },
];

export default function ExaminationAdmitCardPage() {
  return (
    <ExaminationListingPage
      title="Admit Card"
      hindiTitle="प्रवेश पत्र"
      description="Collection of examination admit cards."
      intro="Admit cards are issued to students who have completed enrollment and submitted examination forms with cleared dues."
      items={ADMIT_CARD_ITEMS}
      steps={ADMIT_CARD_STEPS}
    />
  );
}
