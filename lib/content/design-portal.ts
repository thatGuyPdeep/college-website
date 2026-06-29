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

/** IIT Kanpur–style hero portal tiles */
export const HOME_HERO_PORTALS = [
  {
    title: "Admission",
    subtitle: "Apply for UG & ITI programmes",
    href: "/admissions/apply",
    image: "/images/school-1.jpg",
  },
  {
    title: "Research",
    subtitle: "Facilities · Extension · Labs",
    href: "/research",
    image: "/images/ashrama-3.jpg",
  },
  {
    title: "People",
    subtitle: "Faculty · Staff · Students",
    href: "/people",
    image: "/images/school-2.jpg",
  },
  {
    title: "Administration",
    subtitle: "Leadership · Governance · IQAC",
    href: "/administration",
    image: "/images/ashrama-4.jpg",
  },
] as const;

/** IITD Academic Units row */
export const HOME_ACADEMIC_UNITS = [
  { title: "Science", href: "/academics/faculties/science" },
  { title: "Social Sciences", href: "/academics/faculties/social-science" },
  { title: "Sports", href: "/academics/faculties/sports" },
  { title: "ITI & Vocational", href: "/academics/iti" },
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
  { label: "Prospectus", href: "/prospectus" },
  { label: "Contact",    href: "/contact" },
  { label: "Calendar",  href: "/academics/calendar" },
  { label: "Notices",   href: "/noticeboard" },
  { label: "Careers",   href: "/careers" },
  { label: "Donate",    href: "/donate" },
  { label: "Alumni",    href: "/alumni" },
  { label: "Search",    href: "/search" },
];

/** IITD-style home quick-access portal tiles */
export const HOME_QUICK_ACCESS = [
  { title: "Apply for Admission", subtitle: "UG · ITI · Session 2026–27", href: "/admissions/apply", accent: "crimson" as const },
  { title: "Noticeboard",         subtitle: "Notices · Circulars · Updates", href: "/noticeboard", accent: "navy" as const },
  { title: "Student ERP",         subtitle: "Marks · Attendance · Timetable", href: "/login?redirect=/student", accent: "navy" as const },
  { title: "Faculty ERP",         subtitle: "Salary · Leave · Attendance", href: "/login?redirect=/faculty-portal", accent: "gold" as const },
  { title: "Prospectus",          subtitle: "Programmes · Fees · Apply", href: "/prospectus", accent: "gold" as const },
  { title: "Mandatory Disclosure", subtitle: "UGC · IQAC · Governance", href: "/disclosure", accent: "navy" as const },
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
