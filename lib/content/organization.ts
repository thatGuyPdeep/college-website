/** Institutional hierarchy — Ramakrishna Mission Ashrama, Narayanpur. */

export type OrgRole = {
  title: string;
  hindi?: string;
  holder?: string;
  reportsTo?: string;
  description: string;
  href?: string;
};

export const ORGANIZATION_INTRO =
  "Ramakrishna Mission Vivekananda College operates as part of Ramakrishna Mission Ashrama, Narainpur — a branch centre of Ramakrishna Math & Ramakrishna Mission, Belur Math. Academic programmes are affiliated to Shaheed Mahendra Karma Vishwavidyalaya (Bastar University).";

export const ORG_TOP_LEVEL: OrgRole[] = [
  {
    title: "Belur Math (Headquarters)",
    hindi: "बेलूर मठ",
    description: "Ramakrishna Math & Ramakrishna Mission — parent organisation.",
    href: "https://belurmath.org",
  },
  {
    title: "Secretary, Ramakrishna Mission Ashrama",
    hindi: "सचिव",
    holder: "Swami Vyaptananda",
    description: "Overall administration of education, healthcare, and tribal welfare in Narayanpur and Abujhmarh.",
    href: "/about/leadership/swami-vyaptananda",
  },
  {
    title: "College Principal",
    hindi: "प्राचार्य",
    description: "Academic head of UG (FYUGP) programmes — faculty, examinations, and student welfare.",
    href: "/about/leadership/principal",
  },
  {
    title: "Affiliating University",
    hindi: "संबद्ध विश्वविद्यालय",
    holder: "Shaheed Mahendra Karma Vishwavidyalaya, Jagdalpur",
    description: "Examination, syllabus, and degree award for undergraduate programmes.",
    href: "https://smkvbastar.ac.in",
  },
];

export const ORG_ACADEMIC_UNITS: OrgRole[] = [
  { title: "Commerce", description: "B.Com (FYUGP)", href: "/academics/departments/commerce" },
  { title: "Computer Science", description: "B.Sc Computer Science (FYUGP)", href: "/academics/departments/computer-science" },
  { title: "Economics", description: "B.A. Economics (FYUGP)", href: "/academics/departments/economics" },
  { title: "Physical Education", description: "B.P.Ed. Sports Education (FYUGP)", href: "/academics/departments/physical-education" },
  { title: "ITI (NCVT)", description: "Vocational trades — 2-year and 1-year programmes", href: "/academics/iti" },
  { title: "IQAC", description: "Internal Quality Assurance Cell", href: "/iqac" },
  { title: "Examination Cell", description: "University examination coordination", href: "/examination" },
];

export const ORG_WELFARE_CELLS: OrgRole[] = [
  { title: "Dean / Student Welfare", description: "Counselling and student services", href: "/students-corner#welfare" },
  { title: "Anti-Ragging Cell", description: "UGC anti-ragging compliance", href: "/cells/anti-ragging" },
  { title: "Grievance Redressal (SGRC)", description: "Student grievances", href: "/cells/sgrc" },
  { title: "Women Cell", description: "Women students and staff support", href: "/cells/women-cell" },
  { title: "NSS Unit", description: "Community service", href: "/nss" },
];
