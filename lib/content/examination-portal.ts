/**
 * Examination portal — public notices, schedules, and university links.
 * Results are published by Bastar University; college publishes local circulars here.
 */

export type ExamDocument = {
  title: string;
  date?: string;
  href: string;
  external?: boolean;
  language?: "EN" | "HI" | "EN+HI";
  note?: string;
};

export const BASTAR_UNIVERSITY_LINKS = {
  home: "https://smkvbastar.ac.in",
  examination: "https://smkvbastar.ac.in/examination.php",
  results: "https://smkvbastar.ac.in/examination-results.php",
  syllabus: "https://smkvbastar.ac.in",
} as const;

export const EXAMINATION_OFFICE = {
  email: "rkm.narainpur@gmail.com",
  phone: "07781-252251",
  hours: "Mon–Sat, 8:30 AM – 12:00 PM & 2:30 – 5:30 PM",
};

export const EXAM_NOTICES: ExamDocument[] = [
  {
    title: "Odd Semester (Sem I / III / V / VII) — examination schedule session 2026–27",
    date: "Nov 2026",
    href: "/examination/timetables",
    language: "EN",
    note: "Tentative dates per academic calendar; final schedule issued by Bastar University.",
  },
  {
    title: "Semester enrollment — regular students (Odd Semester)",
    date: "Jul 2026",
    href: "/examination/enrollment",
    language: "EN",
  },
  {
    title: "Examination form submission — last date reminder",
    date: "Oct 2026",
    href: "/examination/forms",
    language: "EN",
    note: "Submit completed forms at the college examination cell with fee receipt.",
  },
  {
    title: "Admit card collection — end-semester examinations",
    date: "Nov 2026",
    href: "/examination/admit-card",
    language: "EN",
  },
  {
    title: "Revaluation / retotalling — application window",
    date: "Jan 2027",
    href: "/examination/revaluation",
    language: "EN",
  },
];

export const EXAM_TIMETABLES: ExamDocument[] = [
  {
    title: "Academic Calendar 2026–27 (examination dates)",
    date: "2026–27",
    href: "/academics/calendar",
  },
  {
    title: "Odd Semester — provisional time table",
    date: "Nov 2026",
    href: "/examination/notices",
    note: "Final time table published by Bastar University examination branch.",
  },
  {
    title: "Even Semester — provisional time table",
    date: "May 2027",
    href: "/examination/notices",
    note: "Updated when university notifies.",
  },
  {
    title: "Bastar University — examination notifications",
    date: "Live",
    href: BASTAR_UNIVERSITY_LINKS.examination,
    external: true,
  },
];

export const EXAM_RESULTS: ExamDocument[] = [
  {
    title: "Bastar University — published semester results",
    date: "Live",
    href: BASTAR_UNIVERSITY_LINKS.results,
    external: true,
    note: "UG (FYUGP) results are hosted on the affiliating university portal.",
  },
  {
    title: "College merit list — Odd Semester (when published)",
    date: "—",
    href: "/examination/merit",
  },
  {
    title: "Revaluation results — after university declaration",
    date: "—",
    href: "/examination/revaluation",
  },
];

export const EXAM_FORMS: ExamDocument[] = [
  {
    title: "Examination form — semester appearance (collect from office)",
    href: "/contact?subject=Examination%20Form",
    note: "Available at the examination cell during working hours.",
  },
  {
    title: "Backlog / supplementary examination form",
    href: "/contact?subject=Supplementary%20Examination",
  },
  {
    title: "Revaluation application form",
    href: "/examination/revaluation",
  },
  {
    title: "Anti-ragging affidavit (required for enrollment)",
    href: "/forms#anti-ragging",
  },
  {
    title: "All downloadable forms",
    href: "/forms",
  },
];

export const ENROLLMENT_STEPS = [
  "Verify eligibility and cleared dues with the accounts section.",
  "Collect the semester enrollment form from the examination cell.",
  "Submit the form with passport-size photographs and fee receipt.",
  "Collect acknowledgement slip — required for admit card issue.",
  "Online enrollment via student portal will be enabled in Phase 2.",
];

export const ADMIT_CARD_STEPS = [
  "Complete semester enrollment and examination form submission.",
  "Clear all outstanding library and hostel dues (if applicable).",
  "Collect admit card from the examination cell 3–5 days before exams.",
  "Bring college ID and admit card to every examination.",
];

export const REVALUATION_STEPS = [
  "Apply within the window notified by Bastar University after result declaration.",
  "Pay prescribed revaluation fee at the college accounts section.",
  "Submit application with copy of mark sheet to the examination cell.",
  "Track status through the university portal when results are updated.",
];

export const MERIT_NOTES = [
  "Programme-wise merit lists are prepared by the college after university result publication.",
  "Toppers and distinction holders are notified on the notice board and website.",
  "For official marks and ranks, refer to Bastar University results.",
];
