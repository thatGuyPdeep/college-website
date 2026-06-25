/**
 * Layout & chrome patterns from dual design references:
 * - IIT Delhi (home.iitd.ac.in) — utility bar, portal quick-access, mega-menu density
 * - SMKV Bastar (smkvbastar.ac.in) — bilingual motto, notice metadata, feedback strip
 */

export type UtilityLink = { label: string; href: string; external?: boolean };

/** IITD Revolution Slider — fullscreen hero slides */
export const HERO_SLIDES = [
  {
    image: "/images/school-1.jpg",
    title: "Welcome to RKM Vivekananda College",
    subtitle: "Value-based education serving Abujhmarh since 1985",
    cta: "Know More",
    href: "/about",
  },
  {
    image: "/images/ashrama-4.jpg",
    title: "Follow Your Dreams",
    subtitle: "NEP 2020 four-year undergraduate programmes",
    cta: "Know More",
    href: "/academics",
  },
  {
    image: "/images/school-2.jpg",
    title: "Excellence Through Service",
    subtitle: "Education · Healthcare · Rural Development",
    cta: "Know More",
    href: "/about/activities",
  },
  {
    image: "/images/ev-national-youth-day-2023.jpg",
    title: "Adding Life to Events",
    subtitle: "Campus life, festivals & youth programmes",
    cta: "View Events",
    href: "/events",
  },
] as const;

/** IITD-style hero portal tiles (Research / Startups / News pattern) */
export const HOME_HERO_PORTALS = [
  {
    title: "Admission",
    subtitle: "Apply for UG & ITI programmes",
    href: "/admissions/apply",
    image: "/images/school-1.jpg",
  },
  {
    title: "Examination",
    subtitle: "Results, timetables & forms",
    href: "/examination",
    image: "/images/ashrama-3.jpg",
  },
  {
    title: "Academics",
    subtitle: "NEP 2020 · FYUGP · Syllabus",
    href: "/academics",
    image: "/images/school-2.jpg",
  },
  {
    title: "Seva & Outreach",
    subtitle: "Serving Abujhmarh since 1985",
    href: "/about/activities",
    image: "/images/ashrama-4.jpg",
  },
] as const;

/** IITD Academic Units row */
export const HOME_ACADEMIC_UNITS = [
  { title: "Departments", href: "/academics/departments" },
  { title: "Programmes", href: "/academics" },
  { title: "ITI & Vocational", href: "/academics/iti" },
  { title: "IQAC & Quality", href: "/iqac" },
] as const;

export const HOME_ABOUT = {
  title: "About Ramakrishna Mission Vivekananda College",
  excerpt:
    "Ramakrishna Mission Vivekananda College, Narayanpur is a branch centre of Ramakrishna Math & Ramakrishna Mission, Belur Math. Affiliated to Shaheed Mahendra Karma Vishwavidyalaya (Bastar University), the college offers NEP 2020 four-year undergraduate programmes while serving the Abujhmaria tribal community through value-based, man-making education.",
  readMoreHref: "/about",
  newsletterHref: "/news/feed",
};

/** IITD-style counter strip — college-focused figures */
export const HOME_STATS = [
  { value: "2,730+", label: "Students" },
  { value: "25+", label: "Faculty & Staff" },
  { value: "10+", label: "Programmes" },
  { value: "7", label: "Departments" },
] as const;

/** IITD-style top utility links — compact set (no duplicate quick-links bar) */
export const UTILITY_BAR_LINKS: UtilityLink[] = [
  { label: "Calendar",  href: "/academics/calendar" },
  { label: "Tenders",   href: "/tenders" },
  { label: "Careers",   href: "/careers" },
  { label: "Donate",    href: "/donate" },
  { label: "Notices",   href: "/news?category=Notice" },
  { label: "Alumni",    href: "/alumni" },
  { label: "Forms",     href: "/forms" },
  { label: "Events",    href: "/events" },
  { label: "Search",    href: "/search" },
];

/** IITD-style home quick-access portal tiles */
export const HOME_QUICK_ACCESS = [
  { title: "Apply for Admission", subtitle: "UG · ITI · Session 2026–27", href: "/admissions/apply", accent: "crimson" as const },
  { title: "Examination Portal",  subtitle: "Forms · Results · Time tables", href: "/examination", accent: "navy" as const },
  { title: "Student ERP",         subtitle: "Marks · Attendance · Timetable", href: "/login?redirect=/student", accent: "navy" as const },
  { title: "Syllabus & Academics", subtitle: "FYUGP 2024–28 · Departments", href: "/academics/syllabus", accent: "gold" as const },
  { title: "Library & E-Resources", subtitle: "INFLIBNET · Publications", href: "/campus/library/e-resources", accent: "navy" as const },
  { title: "Mandatory Disclosure", subtitle: "UGC · IQAC · Governance", href: "/disclosure", accent: "gold" as const },
];

export const INSTITUTION_MOTTO = {
  sanskrit: "आत्मनो मोक्षार्थं जगद्धिताय च",
  english:  "For one's own salvation and for the welfare of the world",
  attribution: "Swami Vivekananda",
  hindiTagline: "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत",
  englishTagline: "Arise, awake, and stop not till the goal is reached!",
};

/** SMKV-style footer feedback */
export const FEEDBACK_EMAIL = "rkm.narainpur@gmail.com";
