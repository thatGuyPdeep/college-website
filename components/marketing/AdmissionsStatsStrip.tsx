"use client";

import Link from "next/link";
import {
  ADMISSION_PROGRAMME_STATS,
  ADMISSION_TOTALS,
  ADMISSIONS_SESSION,
  ADMISSIONS_STATS_AS_OF,
} from "@/lib/content/admissions-2026";
import { StaggerReveal } from "@/components/ui/RevealOnScroll";

export function AdmissionsStatsStrip({ compact = false }: { compact?: boolean }) {
  if (!ADMISSION_PROGRAMME_STATS.length) return null;

  return (
    <section
      className={compact ? "mb-8" : "bg-[#2b2d3b] text-white border-b border-[#B80F0A]/30"}
      aria-labelledby="admission-stats-heading"
    >
      <div className={compact ? "" : "container-site py-4 sm:py-5"}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
          <div>
            <h2
              id="admission-stats-heading"
              className="text-sm sm:text-base font-heading font-bold uppercase tracking-wide text-[#F5C200]"
            >
              Applications Received — {ADMISSIONS_SESSION}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              As of {ADMISSIONS_STATS_AS_OF} · {ADMISSION_TOTALS.uniqueApplicants} unique applicants ·{" "}
              {ADMISSION_TOTALS.applicationsReceived} total applications
            </p>
          </div>
          <Link
            href="/admissions/seats"
            className="micro-link-arrow text-xs font-bold uppercase tracking-wide text-white hover:text-[#F5C200] shrink-0 inline-flex items-center gap-1 transition-colors"
          >
            Seats & programme details →
          </Link>
        </div>

        <StaggerReveal className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {ADMISSION_PROGRAMME_STATS.map((p) => (
            <div
              key={p.slug}
              className="border border-white/10 bg-white/5 px-3 py-2.5 text-center micro-lift transition-colors hover:bg-white/10 hover:border-white/20"
            >
              <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">{p.uniqueApplicants}</p>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-snug">{p.programme}</p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
