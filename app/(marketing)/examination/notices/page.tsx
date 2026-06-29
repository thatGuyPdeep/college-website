import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { EXAM_NOTICES } from "@/lib/content/examination-portal";
import { getPublicExamNotices, publicNewsToExamDocument } from "@/lib/content/public-data";

export const metadata: Metadata = { title: "Examination Notices" };

export default async function ExaminationNoticesPage() {
  const cms = await getPublicExamNotices();
  const items = cms.length > 0 ? cms.map(publicNewsToExamDocument) : EXAM_NOTICES;

  return (
    <ExaminationListingPage
      title="Examination Notices"
      hindiTitle="परीक्षा अधिसूचनाएँ"
      description="Circulars and notifications related to semester and annual examinations."
      intro="Examination circulars for Ramakrishna Mission Vivekananda College students affiliated to Bastar University. Notices published by the examination cell appear here; final notifications are also on the university website."
      items={items}
    />
  );
}
