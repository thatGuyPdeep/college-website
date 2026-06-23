import type { Metadata } from "next";
import { ExaminationListingPage } from "@/components/marketing/ExaminationListingPage";
import { MERIT_NOTES } from "@/lib/content/examination-portal";

export const metadata: Metadata = { title: "Merit Lists" };

const MERIT_ITEMS = [
  {
    title: "Odd Semester merit list — session 2026–27",
    date: "When published",
    href: "/examination/notices",
    note: "Posted on notice board and website after university results.",
  },
  {
    title: "Even Semester merit list — session 2026–27",
    date: "When published",
    href: "/examination/notices",
  },
];

export default function ExaminationMeritPage() {
  return (
    <ExaminationListingPage
      title="Merit Lists"
      hindiTitle="मेरिट सूची"
      description="Programme-wise merit and distinction lists."
      intro={MERIT_NOTES.join(" ")}
      items={MERIT_ITEMS}
    />
  );
}
