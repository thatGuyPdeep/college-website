/**
 * SMKV Bastar (smkvbastar.ac.in) reference structure — adapted for RKM College.
 * Content is institution-specific; layout/feature classes mirror the reference site.
 */

export type PortalLink = { label: string; href: string; external?: boolean; description?: string };

export const QUICK_LINKS: PortalLink[] = [
  { label: "Notices & Circulars", href: "/news?category=Notice" },
  { label: "Events",              href: "/events" },
  { label: "Download Forms",      href: "/forms" },
  { label: "Tenders",             href: "/tenders" },
  { label: "Mandatory Disclosure", href: "/disclosure" },
  { label: "RTI",                 href: "/rti" },
];

export const HOME_ANNOUNCEMENTS = [
  {
    title: "Admissions Open 2026–27",
    subtitle: "UG (FYUGP), ITI trades & vocational programmes",
    href: "/admissions/apply",
    cta: "Apply Now",
    variant: "primary" as const,
  },
  {
    title: "Faculty & Staff Vacancies",
    subtitle: "Teaching and non-teaching positions — apply online",
    href: "/careers",
    cta: "View Vacancies",
    variant: "secondary" as const,
  },
  {
    title: "Examination Notices",
    subtitle: "Timetables, forms, results & enrollment",
    href: "/examination",
    cta: "Examination Portal",
    variant: "navy" as const,
  },
];

/** Shown once per session on the home page (SMKV important-notice modal pattern). */
export const URGENT_HOME_NOTICE = {
  id:      "admissions-2026-27",
  title:   "Admissions Open 2026–27",
  message: "Applications are invited for UG (FYUGP) programmes under NEP 2020 and NCVT-affiliated ITI trades. Apply online or check seat availability.",
  href:    "/admissions/apply",
  cta:     "Apply Now",
};

import { LEADERSHIP_PROFILES } from "@/lib/content/leadership-profiles";

export const LEADERSHIP_SPOTLIGHT = LEADERSHIP_PROFILES.slice(0, 2).map((p) => ({
  role:        p.title,
  name:        p.name,
  org:         p.org,
  messageHref: `/about/leadership/${p.slug}`,
  profileHref: `/about/leadership/${p.slug}`,
  image:       p.image,
}));

export const STATUTORY_CELLS = [
  {
    slug: "rti",
    name: "RTI Cell",
    hindi: "सूचना का अधिकार प्रकोष्ठ",
    summary: "Right to Information requests, public information officer, and appeals.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "anti-ragging",
    name: "Anti-Ragging Cell",
    hindi: "अंतर-रैगिंग प्रकोष्ठ",
    summary: "Anti-ragging policy, affidavit, helpline, and complaint procedure per UGC regulations.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "icc",
    name: "ICC (Sexual Harassment at Workplace)",
    hindi: "विश्वविद्यालय महिला शिकायत प्रकोष्ठ",
    summary: "Internal Complaints Committee under the POSH Act — confidential grievance redressal.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "sgrc",
    name: "Students Grievance & Redressal Cell",
    hindi: "छात्र शिकायत निवारण प्रकोष्ठ",
    summary: "Student grievances related to academics, examination, hostel, and campus services.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "women-cell",
    name: "Women Cell",
    hindi: "महिला प्रकोष्ठ",
    summary: "Programmes and support for women students and staff.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "sc-st-cell",
    name: "SC & ST Cell",
    hindi: "अनुसूचित जाति एवं जनजाति प्रकोष्ठ",
    summary: "Scholarships, reservation policy, and support for SC/ST students.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "minority-cell",
    name: "Minority Cell",
    hindi: "अल्पसंख्यक प्रकोष्ठ",
    summary: "Support and grievance redressal for minority community students.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "ugc-cell",
    name: "UGC Cell",
    hindi: "यूजीसी प्रकोष्ठ",
    summary: "UGC schemes, mandatory disclosure, and compliance reporting.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "iqac",
    name: "IQAC",
    hindi: "आंतरिक गुणवत्ता आश्वासन प्रकोष्ठ",
    summary: "Internal Quality Assurance Cell — AQAR, feedback, and accreditation.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "it-cell",
    name: "IT Cell",
    hindi: "सूचना प्रौद्योगिकी प्रकोष्ठ",
    summary: "Website, student portals, and technical support.",
    contact: "rkm.narainpur@gmail.com",
  },
] as const;

export const EXAMINATION_SECTIONS: {
  title: string;
  description: string;
  links: PortalLink[];
}[] = [
  {
    title: "Notices & Notifications",
    description: "Examination circulars, enrollment notices, and schedule updates.",
    links: [
      { label: "All Notices", href: "/news?category=Notice" },
      { label: "Examination Notices", href: "/examination/notices" },
    ],
  },
  {
    title: "Enrollment & Forms",
    description: "Semester enrollment and examination form submission.",
    links: [
      { label: "Online Enrollment (Regular)", href: "/examination/enrollment" },
      { label: "Examination Form — Apply", href: "/examination/forms" },
      { label: "Download Forms", href: "/forms" },
    ],
  },
  {
    title: "Time Tables",
    description: "Annual, semester, and supplementary examination schedules.",
    links: [
      { label: "Semester Time Tables", href: "/examination/timetables" },
    ],
  },
  {
    title: "Results",
    description: "Published examination results by session and programme.",
    links: [
      { label: "Semester Results", href: "/examination/results" },
      { label: "Merit Lists", href: "/examination/merit" },
    ],
  },
  {
    title: "Revaluation & Retotalling",
    description: "Apply for answer script review and rechecking.",
    links: [
      { label: "Retotalling / Revaluation", href: "/examination/revaluation" },
    ],
  },
  {
    title: "Downloads",
    description: "Admit cards, enrollment cards, and question papers.",
    links: [
      { label: "Admit Card", href: "/examination/admit-card" },
      { label: "Old Question Papers", href: "/campus/library/e-resources#question-papers" },
      { label: "Academic Certificates", href: "/students-corner#certificates" },
    ],
  },
];

export const STUDENTS_CORNER_LINKS: {
  title: string;
  links: PortalLink[];
}[] = [
  {
    title: "Student Support",
    links: [
      { label: "Dean / Student Welfare", href: "/students-corner#welfare" },
      { label: "Academic Certificates", href: "/students-corner#certificates" },
      { label: "Training & Placement", href: "/placements" },
      { label: "Course Syllabus", href: "/academics" },
      { label: "Department Notices", href: "/news?category=Notice" },
    ],
  },
  {
    title: "Hostel",
    links: [
      { label: "Hostel Facilities", href: "/campus/hostel" },
      { label: "Hostel Rules & Fees", href: "/campus/hostel#rules" },
      { label: "Apply for Hostel", href: "/students-corner#hostel-apply" },
    ],
  },
  {
    title: "Compliance & Welfare",
    links: [
      { label: "Anti-Ragging", href: "/cells/anti-ragging" },
      { label: "Grievance Redressal", href: "/cells/sgrc" },
      { label: "NSS", href: "/students-corner#nss" },
    ],
  },
  {
    title: "Portals",
    links: [
      { label: "Student ERP Login", href: "/login?redirect=/student" },
      { label: "Track Application", href: "/admissions/dashboard" },
      { label: "Online Study Material", href: "/campus/library/e-resources" },
    ],
  },
];

export const GOVERNMENT_PORTALS: PortalLink[] = [
  { label: "DigiLocker", href: "https://www.digilocker.gov.in", external: true },
  { label: "ABC — Academic Bank of Credits", href: "https://www.abc.gov.in", external: true },
  { label: "UGC", href: "https://www.ugc.gov.in", external: true },
  { label: "NAAC", href: "https://www.naac.gov.in", external: true },
  { label: "SWAYAM", href: "https://swayam.gov.in", external: true },
  { label: "NPTEL", href: "https://nptel.ac.in", external: true },
  { label: "National Scholarship Portal", href: "https://scholarships.gov.in", external: true },
  { label: "Bastar University (SMKV)", href: "https://smkvbastar.ac.in", external: true },
  { label: "Chhattisgarh Higher Education", href: "https://highereducation.cg.gov.in", external: true },
  { label: "NCVT MIS", href: "https://ncvtmis.gov.in", external: true },
  { label: "Publications — Ramakrishna Mission", href: "https://publications.rkmm.org", external: true },
];

export const DOWNLOAD_FORMS: { label: string; href: string; size?: string }[] = [
  { label: "Admission Application Form (PDF)", href: "/admissions/apply", size: "Online" },
  { label: "Anti-Ragging Affidavit", href: "/forms#anti-ragging", size: "PDF" },
  { label: "Hostel Application Form", href: "/forms#hostel", size: "PDF" },
  { label: "Transfer Certificate Request", href: "/forms#tc", size: "PDF" },
  { label: "Character Certificate Request", href: "/forms#character", size: "PDF" },
  { label: "Migration Certificate Request", href: "/forms#migration", size: "PDF" },
];

export const LIBRARY_E_RESOURCES: {
  category: string;
  links: PortalLink[];
}[] = [
  {
    category: "Institutional",
    links: [
      { label: "Online Reading — Ramakrishna Mission", href: "https://publications.rkmm.org", external: true },
      { label: "Old Question Papers", href: "/examination#question-papers" },
      { label: "University Publications", href: "/disclosure" },
    ],
  },
  {
    category: "National Portals",
    links: [
      { label: "Shodhganga", href: "https://shodhganga.inflibnet.ac.in", external: true },
      { label: "NDL — National Digital Library", href: "https://ndl.iitkgp.ac.in", external: true },
      { label: "DELNET", href: "http://delnet.in", external: true },
      { label: "SWAYAM Prabha", href: "https://www.swayamprabha.gov.in", external: true },
      { label: "e-PG Pathshala", href: "https://epgp.inflibnet.ac.in", external: true },
    ],
  },
  {
    category: "Hindi & Open Resources",
    links: [
      { label: "Hindi e-Resources (publications.rkmm.org)", href: "https://publications.rkmm.org/hindi", external: true },
      { label: "MOOCs — UGC", href: "https://ugcmoocs.inflibnet.ac.in", external: true },
    ],
  },
];

export const IQAC_CONTENT = {
  vision: "To develop a system for conscious, consistent and catalytic improvement in the academic and administrative performance of the institution.",
  functions: [
    "Development and application of quality benchmarks for academic and administrative activities",
    "Organising workshops and seminars on quality themes",
    "Documentation of programmes leading to quality improvement",
    "Preparation of Annual Quality Assurance Report (AQAR)",
    "Collection and analysis of feedback from stakeholders",
  ],
  documents: [
    { label: "IQAC Constitution", href: "/iqac#constitution" },
    { label: "AQAR Reports", href: "/iqac#aqar" },
    { label: "Feedback Form", href: "/iqac#feedback" },
    { label: "Mandatory Disclosure", href: "/disclosure" },
  ],
};

export const NEP_2020_POINTS = [
  {
    title: "Four-Year Undergraduate Programme (FYUGP)",
    body: "Multidisciplinary, flexible UG education with multiple exit options — Certificate (1 yr), Diploma (2 yr), Bachelor's (3 yr), Honours / Research (4 yr).",
  },
  {
    title: "Academic Bank of Credits (ABC)",
    body: "Digital storehouse of credits earned — students can transfer credits across institutions via DigiLocker integration.",
  },
  {
    title: "Skill & Vocational Integration",
    body: "ITI trades and vocational training aligned with NEP's emphasis on employability and experiential learning.",
  },
  {
    title: "Indian Knowledge Systems",
    body: "Value-based education rooted in Swami Vivekananda's man-making ideal, integrated with modern curricula.",
  },
];
