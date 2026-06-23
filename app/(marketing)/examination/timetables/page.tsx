import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { EXAM_TIMETABLES, BASTAR_UNIVERSITY_LINKS } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Examination Time Tables" };

export default function ExaminationTimetablesPage() {
  return (
    <ExaminationListingPage
      title="Time Tables"
      hindiTitle="समय सारणी"
      description="Semester and annual examination schedules."
      intro="Provisional schedules follow the academic calendar. The affiliating university publishes the final time table."
      items={EXAM_TIMETABLES}
      externalCta={{
        label: "Bastar University examination portal",
        href: BASTAR_UNIVERSITY_LINKS.examination,
      }}
    />
  );
}
