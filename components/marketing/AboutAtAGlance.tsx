import Link from "next/link";
import { STATS, RKM_FACTS } from "@/lib/utils/constants";
import { ADMISSION_TOTALS, ADMISSIONS_SESSION } from "@/lib/content/admissions-2026";

const EXTRA = [
  { value: "200+", label: "Villages Served" },
  { value: "1985", label: "Founded" },
];

/** SMKV “University at a Glance” pattern — key institutional figures */
export function AboutAtAGlance() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-[#F0F4FF] p-6 sm:p-8" aria-labelledby="at-a-glance-heading">
      <h2 id="at-a-glance-heading" className="text-lg font-bold text-[#0D2660] mb-4">
        Institution at a Glance
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-[#0D2660]">{s.value}</p>
            <p className="text-xs text-gray-600 mt-1 leading-snug">{s.label}</p>
          </div>
        ))}
        {EXTRA.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-[#0D2660]">{s.value}</p>
            <p className="text-xs text-gray-600 mt-1 leading-snug">{s.label}</p>
          </div>
        ))}
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C8201A]">{ADMISSION_TOTALS.uniqueApplicants}</p>
          <p className="text-xs text-gray-600 mt-1 leading-snug">UG Applicants ({ADMISSIONS_SESSION})</p>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Affiliated to {RKM_FACTS.university}.{" "}
        <Link href="/about/milestones" className="text-[#0D2660] font-semibold hover:underline">
          View milestones →
        </Link>
      </p>
    </section>
  );
}
