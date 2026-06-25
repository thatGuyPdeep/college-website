import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { EXAM_NOTICES } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Examination Notices" };

export default function ExaminationNoticesPage() {
  return (
    <ExaminationListingPage
      title="Examination Notices"
      hindiTitle="परीक्षा अधिसूचनाएँ"
      description="Circulars and notifications related to semester and annual examinations."
      intro="Examination circulars for Ramakrishna Mission Vivekananda College students affiliated to Bastar University. Final notifications are also published on the university website."
      items={EXAM_NOTICES}
    />
  );
}
