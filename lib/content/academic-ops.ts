/**
 * Academic calendar and seat availability — SMKV Bastar reference patterns.
 * ITI figures from Obsidian external/iti-rkmitinpr.md; UG intake per Bastar University affiliation.
 */

import { PROGRAMS } from "@/lib/utils/constants";
import {
  ITI_TRADES_ENGINEERING,
  ITI_TRADES_NON_ENGINEERING,
} from "@/lib/content/iti";
import { getAdmissionStatBySlug } from "@/lib/content/admissions-2026";

export const ACADEMIC_SESSION = "2026–27";

export type CalendarEntry = {
  title: string;
  titleHi?: string;
  from: string;
  to?: string;
  category: "admission" | "academic" | "examination" | "holiday";
};

/** Published academic calendar — update annually when university notifies dates. */
export const ACADEMIC_CALENDAR: CalendarEntry[] = [
  {
    title: "Online admission applications open (UG FYUGP & ITI)",
    titleHi: "ऑनलाइन प्रवेश आवेदन प्रारंभ",
    from: "May 2026",
    category: "admission",
  },
  {
    title: "Document verification & counselling (UG)",
    titleHi: "दस्तावेज़ सत्यापन एवं परामर्श",
    from: "June 2026",
    to: "July 2026",
    category: "admission",
  },
  {
    title: "ITI admission & trade allotment",
    titleHi: "आई.टी.आई. प्रवेश एवं व्यवसाय आवंटन",
    from: "July 2026",
    to: "August 2026",
    category: "admission",
  },
  {
    title: "Commencement of classes — Odd Semester (Sem I / III / V / VII)",
    titleHi: "विषम सेमेस्टर — कक्षाएँ प्रारंभ",
    from: "1 Aug 2026",
    category: "academic",
  },
  {
    title: "Internal assessment & mid-semester activities",
    titleHi: "आंतरिक मूल्यांकन",
    from: "Sep 2026",
    to: "Oct 2026",
    category: "academic",
  },
  {
    title: "University end-semester examinations (Odd Semester)",
    titleHi: "विषम सेमेस्टर परीक्षा",
    from: "Nov 2026",
    to: "Dec 2026",
    category: "examination",
  },
  {
    title: "Winter break",
    titleHi: "शीतकालीन अवकाश",
    from: "24 Dec 2026",
    to: "1 Jan 2027",
    category: "holiday",
  },
  {
    title: "Commencement of classes — Even Semester (Sem II / IV / VI / VIII)",
    titleHi: "सम सेमेस्टर — कक्षाएँ प्रारंभ",
    from: "5 Jan 2027",
    category: "academic",
  },
  {
    title: "University end-semester examinations (Even Semester)",
    titleHi: "सम सेमेस्टर परीक्षा",
    from: "May 2027",
    category: "examination",
  },
  {
    title: "Summer vacation",
    titleHi: "ग्रीष्म अवकाश",
    from: "15 May 2027",
    to: "31 Jul 2027",
    category: "holiday",
  },
];

export const CALENDAR_CATEGORY_LABELS: Record<CalendarEntry["category"], string> = {
  admission:    "Admission",
  academic:     "Academic",
  examination:  "Examination",
  holiday:      "Holiday",
};

export type SeatRow = {
  programme: string;
  department?: string;
  duration: string;
  sanctioned: number | string;
  applicationsReceived?: number | string;
  units?: number;
  shifts?: string;
  seatsPerUnit?: number;
  level: string;
  eligibility?: string;
  slug?: string;
};

/** UG programmes — sanctioned intake as notified by affiliating university. */
export const UG_SEAT_ROWS: SeatRow[] = PROGRAMS.map((p) => {
  const stats = getAdmissionStatBySlug(p.slug);
  return {
    programme:  p.name,
    department: p.dept,
    duration:   p.duration,
    sanctioned: "As notified",
    applicationsReceived: stats?.uniqueApplicants ?? "—",
    level:      "UG (FYUGP)",
    eligibility: "12th pass (relevant stream)",
    slug:       p.slug,
  };
});

export const ITI_SEAT_ROWS: SeatRow[] = [
  ...ITI_TRADES_ENGINEERING.map((t) => ({
    programme:     t.trade,
    duration:      t.duration,
    sanctioned:    t.seats,
    units:         2,
    shifts:        "I & II",
    seatsPerUnit:  Math.round(t.seats / 2),
    level:         "ITI (NCVT)",
    eligibility:   t.eligibility,
  })),
  ...ITI_TRADES_NON_ENGINEERING.map((t) => ({
    programme:     t.trade,
    duration:      t.duration,
    sanctioned:    t.seats,
    units:         2,
    shifts:        "I & II",
    seatsPerUnit:  Math.round(t.seats / 2),
    level:         "ITI (NCVT)",
    eligibility:   t.eligibility,
  })),
];

export const VIDYAPEETH_SEAT_ROWS: SeatRow[] = [
  { programme: "Science", level: "Class XI–XII", duration: "2 years", sanctioned: "Residential", eligibility: "10th pass" },
  { programme: "Commerce", level: "Class XI–XII", duration: "2 years", sanctioned: "Residential", eligibility: "10th pass" },
  { programme: "Arts", level: "Class XI–XII", duration: "2 years", sanctioned: "Residential", eligibility: "10th pass" },
  { programme: "Agriculture", level: "Class XI–XII", duration: "2 years", sanctioned: "Residential", eligibility: "10th pass" },
  { programme: "Home Science", level: "Class XI–XII", duration: "2 years", sanctioned: "Residential", eligibility: "10th pass" },
];

export const ITI_TOTAL_SEATS = ITI_SEAT_ROWS.reduce(
  (sum, r) => sum + (typeof r.sanctioned === "number" ? r.sanctioned : 0),
  0,
);
