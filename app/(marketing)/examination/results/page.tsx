import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { EXAM_RESULTS, BASTAR_UNIVERSITY_LINKS } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Examination Results" };

export default function ExaminationResultsPage() {
  return (
    <ExaminationListingPage
      title="Semester Results"
      hindiTitle="परिणाम"
      description="Published examination results for UG programmes."
      intro="Semester results for FYUGP programmes are declared by Shaheed Mahendra Karma Vishwavidyalaya (Bastar University). Use the university portal for official marks."
      items={EXAM_RESULTS}
      externalCta={{
        label: "View results on Bastar University portal",
        href: BASTAR_UNIVERSITY_LINKS.results,
      }}
    />
  );
}
