import type { Metadata } from "next";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { MILESTONE_TIMELINE, MILESTONES_INTRO } from "@/lib/content/milestones";

export const metadata: Metadata = {
  title: "Milestones",
  description: "Important milestones in the history of Ramakrishna Mission Ashrama, Narainpur (1985–present).",
};

export default function MilestonesPage() {
  const years = [...new Set(MILESTONE_TIMELINE.map((m) => m.year))].sort();

  return (
    <MarketingPage
      title="Important Milestones"
      hindiTitle="महत्वपूर्ण उपलब्धियाँ"
      description={MILESTONES_INTRO}
      breadcrumbs={[{ label: "About", href: "/about" }]}
    >
      <div className="max-w-3xl">
        {years.map((year) => {
          const entries = MILESTONE_TIMELINE.filter((m) => m.year === year);
          return (
            <section key={year} className="relative pl-8 pb-8 border-l-2 border-[#F5C200]/60 last:pb-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0D2660] border-2 border-[#F5C200]" aria-hidden="true" />
              <h2 className="text-xl font-bold text-[#0D2660] mb-3 -mt-1">{year}</h2>
              <ul className="space-y-3">
                {entries.map((entry) => (
                  <li key={`${entry.year}-${entry.date ?? ""}-${entry.event.slice(0, 40)}`} className="text-sm text-gray-600 leading-relaxed">
                    {entry.date && (
                      <span className="inline-block font-semibold text-[#C8201A] mr-2 tabular-nums">{entry.date}</span>
                    )}
                    {entry.event}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </MarketingPage>
  );
}
