import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { EXAM_FORMS } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Examination Forms" };

export default function ExaminationFormsPage() {
  return (
    <ExaminationListingPage
      title="Examination Forms"
      hindiTitle="परीक्षा प्रपत्र"
      description="Semester examination forms, supplementary forms, and related downloads."
      intro="Collect examination forms from the college office or use the links below. Submit completed forms with fee receipt to the examination cell."
      items={EXAM_FORMS}
    />
  );
}
