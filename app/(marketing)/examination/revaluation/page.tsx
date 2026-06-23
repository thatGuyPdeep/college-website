import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { REVALUATION_STEPS } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Revaluation & Retotalling" };

const REVALUATION_ITEMS = [
  {
    title: "Revaluation application — collect from examination cell",
    href: "/contact?subject=Revaluation%20Application",
    note: "Apply within the university-notified window after results.",
  },
  {
    title: "Retotalling request form",
    href: "/contact?subject=Retotalling",
  },
  {
    title: "Fee schedule — contact accounts section",
    href: "/admissions/fees",
  },
];

export default function ExaminationRevaluationPage() {
  return (
    <ExaminationListingPage
      title="Revaluation & Retotalling"
      hindiTitle="पुनर्मूल्यांकन"
      description="Apply for answer script review and mark rechecking."
      intro="Revaluation and retotalling follow Bastar University rules. Submit applications through the college examination cell with prescribed fee."
      items={REVALUATION_ITEMS}
      steps={REVALUATION_STEPS}
    />
  );
}
