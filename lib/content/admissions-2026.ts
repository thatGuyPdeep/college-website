/**
 * UG admission application statistics — session 2026–27.
 * Sourced from RKM-Narainpur-Admissions-2026.xlsx (Summary sheet).
 * Re-sync: python scripts/sync-admissions-stats.py
 * PII (names, emails, phones) is never published on the public site.
 *
 * Portal programme codes (Bastar University ucanapply) may differ from the
 * four programmes RMVK actually offers — see PROGRAMS in constants.ts.
 */

export const ADMISSIONS_SESSION = "2026–27";

export const ADMISSIONS_STATS_AS_OF = "22 June 2026";

export type AdmissionProgrammeStat = {
  programme: string;
  slug: string;
  universityCode: string;
  applicationsReceived: number;
  uniqueApplicants: number;
};

export const ADMISSION_PROGRAMME_STATS: AdmissionProgrammeStat[] = [
  {
    programme: "BA (Bachelor of Arts)",
    slug: "ba-humanities",
    universityCode: "C0001704-BA(BA)",
    applicationsReceived: 30,
    uniqueApplicants: 25,
  },
  {
    programme: "B.Sc Science",
    slug: "bsc-science",
    universityCode: "C0002704-B.Sc Science()",
    applicationsReceived: 8,
    uniqueApplicants: 7,
  },
  {
    programme: "B.Sc Life Science",
    slug: "bsc-life-science",
    universityCode: "C0003704-B.Sc Life Science()",
    applicationsReceived: 50,
    uniqueApplicants: 42,
  },
  {
    programme: "B.Com (Bachelor of Commerce)",
    slug: "bcom",
    universityCode: "C0005704-B.Com()",
    applicationsReceived: 6,
    uniqueApplicants: 6,
  },
];

export const ADMISSION_TOTALS = {
  applicationsReceived: 94,
  uniqueApplicants: 80,
} as const;

export function getAdmissionStatBySlug(slug: string): AdmissionProgrammeStat | undefined {
  return ADMISSION_PROGRAMME_STATS.find((p) => p.slug === slug);
}
