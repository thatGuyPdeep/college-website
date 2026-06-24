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
  {
    slug: "aishe",
    name: "AISHE Cell",
    hindi: "एआईएसएचई प्रकोष्ठ",
    summary: "All India Survey on Higher Education — data submission and compliance.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "rusa",
    name: "RUSA Cell",
    hindi: "रुसा प्रकोष्ठ",
    summary: "Rashtriya Uchchatar Shiksha Abhiyan — quality enhancement schemes.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "state-planning",
    name: "State Planning Cell",
    hindi: "राज्य योजना प्रकोष्ठ",
    summary: "State higher-education planning, proposals, and scheme coordination.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "research-promotion",
    name: "Research Promotion Cell",
    hindi: "अनुसंधान संवर्धन प्रकोष्ठ",
    summary: "Research projects, publications, and faculty research support.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "women-empowerment",
    name: "Women Empowerment Cell",
    hindi: "महिला सशक्तिकरण प्रकोष्ठ",
    summary: "Programmes for empowerment and leadership among women students and staff.",
    contact: "rkm.narainpur@gmail.com",
  },
  {
    slug: "women-employees-complaint",
    name: "Women Employees Complaint Cell",
    hindi: "महिला कर्मचारी शिकायत प्रकोष्ठ",
    summary: "Workplace grievance redressal for women employees.",
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
      { label: "Other Downloads", href: "/forms" },
    ],
  },
  {
    title: "Panel Valuation",
    description: "Answer script request and panel valuation (university process).",
    links: [
      { label: "Revaluation & Retotalling", href: "/examination/revaluation" },
      { label: "Bastar University Portal", href: "https://smkvbastar.in", external: true },
    ],
  },
  {
    title: "Support",
    description: "Examination control room, helpline, and complaints.",
    links: [
      { label: "Examination Control Room", href: "/examination/helpline" },
      { label: "Helpline Support", href: "/examination/helpline" },
      { label: "Complaint / Feedback", href: "/contact?subject=Examination%20Complaint" },
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
      { label: "NSS", href: "/nss" },
      { label: "Online Study Material", href: "/study-material" },
    ],
  },
  {
    title: "Portals",
    links: [
      { label: "Student ERP Login", href: "/login?redirect=/student" },
      { label: "Track Application", href: "/admissions/dashboard" },
      { label: "Online Study Material", href: "/study-material" },
    ],
  },
];

export const ALUMNI_PORTAL = {
  about: "The Ramakrishna Mission College alumni network connects graduates serving across Bastar, India, and abroad — in education, healthcare, government, and social service.",
  registrationNote: "Alumni may register contact details with the college office for reunions, mentorship, and institutional updates.",
  links: [
    { label: "Register / Update Details", href: "/contact?subject=Alumni%20Registration" },
    { label: "Photo Gallery", href: "/gallery" },
    { label: "News & Events", href: "/news" },
    { label: "Donate to the Mission", href: "/donate" },
  ] as PortalLink[],
};

export const NSS_CONTENT = {
  about: "The National Service Scheme (NSS) unit at Ramakrishna Mission College organises community service, health camps, literacy drives, and tribal village outreach in Narayanpur and Abujhmarh.",
  activities: [
    "Blood donation and health awareness camps",
    "Literacy programmes in interior villages",
    "Swachhata and environmental drives",
    "National Youth Day and Republic Day service programmes",
  ],
  reports: [
    { label: "NSS Annual Report — request from office", href: "/contact?subject=NSS%20Annual%20Report" },
    { label: "Event photos", href: "/gallery" },
  ],
};

export const STUDY_MATERIAL_LINKS: { category: string; links: PortalLink[] }[] = [
  {
    category: "College Resources",
    links: [
      { label: "Syllabus (FYUGP)", href: "/academics/syllabus" },
      { label: "Academic Calendar", href: "/academics/calendar" },
      { label: "Library E-Resources", href: "/campus/library/e-resources" },
      { label: "Old Question Papers", href: "/campus/library/e-resources#question-papers" },
    ],
  },
  {
    category: "National E-Learning",
    links: [
      { label: "SWAYAM", href: "https://swayam.gov.in", external: true },
      { label: "NPTEL", href: "https://nptel.ac.in", external: true },
      { label: "e-PG Pathshala", href: "https://epgp.inflibnet.ac.in", external: true },
      { label: "UGC MOOCs", href: "https://ugcmoocs.inflibnet.ac.in", external: true },
    ],
  },
  {
    category: "Mission Publications",
    links: [
      { label: "Online Reading — publications.rkmm.org", href: "https://publications.rkmm.org", external: true },
      { label: "Hindi e-Resources", href: "https://publications.rkmm.org/hindi", external: true },
    ],
  },
];

export const MEDIA_SECTIONS: PortalLink[] = [
  { label: "University in News", href: "/news" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Videos", href: "/gallery#videos" },
  { label: "Press Releases", href: "/news?category=Notice" },
  { label: "Notices & Circulars", href: "/news?category=Notice" },
  { label: "Newsletter (RSS)", href: "/news/feed" },
  { label: "Annual Report", href: "/disclosure" },
];

export const GOVERNANCE_CONTENT = {
  intro: "Ramakrishna Mission College functions under the governance framework of Ramakrishna Math & Ramakrishna Mission, Belur Math, and is affiliated to Shaheed Mahendra Karma Vishwavidyalaya (Bastar University).",
  bodies: [
    {
      title: "Governing Body",
      description: "Overall policy, finance, and institutional direction — chaired by the Secretary, Ramakrishna Mission Ashrama, Narainpur.",
    },
    {
      title: "Academic Council",
      description: "Academic standards, curriculum implementation, examination coordination, and faculty matters as per university affiliation norms.",
    },
    {
      title: "Finance Committee",
      description: "Budget preparation, audit compliance, and financial oversight for college operations.",
    },
  ],
  documents: [
    { label: "Mandatory Disclosure", href: "/disclosure" },
    { label: "IQAC & AQAR", href: "/iqac" },
    { label: "RTI", href: "/rti" },
    { label: "Statutory Cells", href: "/cells" },
    { label: "Meeting minutes — contact office", href: "/contact?subject=Governance%20Documents" },
  ] as PortalLink[],
};

export const EXAMINATION_HELPLINE = {
  title: "Examination Control Room & Helpline",
  hours: "Monday–Saturday, 10:00 AM – 4:00 PM (working days)",
  email: "rkm.narainpur@gmail.com",
  phone: "07781-252251",
  address: "Ramakrishna Mission College, Narayanpur, Chhattisgarh 494661",
  notes: [
    "For enrollment, admit card, and result queries — bring enrollment number and valid ID.",
    "Revaluation and retotalling applications follow Bastar University schedules.",
    "Online result and enrollment modules are linked from the Results and Enrollment pages.",
  ],
};

export const GOVERNMENT_PORTALS: PortalLink[] = [
  { label: "DigiLocker", href: "https://www.digilocker.gov.in", external: true },
  { label: "ABC — Academic Bank of Credits", href: "https://www.abc.gov.in", external: true },
  { label: "Directorate of Technical Education (CG)", href: "https://cgdteraipur.cgstate.gov.in", external: true },
  { label: "Rajbhavan Chhattisgarh", href: "https://rajbhavancg.gov.in", external: true },
  { label: "National Portal of India", href: "https://www.india.gov.in", external: true },
  { label: "Chhattisgarh Higher Education", href: "https://highereducation.cg.gov.in", external: true },
  { label: "Voter Portal", href: "https://voters.eci.gov.in", external: true },
  { label: "CG Vyapam (PEB)", href: "https://vyapam.cgstate.gov.in", external: true },
  { label: "UGC", href: "https://www.ugc.gov.in", external: true },
  { label: "NAAC", href: "https://www.naac.gov.in", external: true },
  { label: "NPTEL", href: "https://nptel.ac.in", external: true },
  { label: "AISHE", href: "https://aishe.gov.in/aishe/home", external: true },
  { label: "NAD — National Academic Depository", href: "https://nad.gov.in", external: true },
  { label: "SWAYAM", href: "https://swayam.gov.in", external: true },
  { label: "SWAYAM Prabha", href: "https://www.swayamprabha.gov.in", external: true },
  { label: "AICTE", href: "https://www.aicte-india.org", external: true },
  { label: "DELNET", href: "http://delnet.in", external: true },
  { label: "INFLIBNET", href: "http://inflibnet.ac.in", external: true },
  { label: "e-PG Pathshala", href: "https://epgp.inflibnet.ac.in", external: true },
  { label: "National Digital Library", href: "https://ndl.iitkgp.ac.in", external: true },
  { label: "UGC MOOCs", href: "https://ugcmoocs.inflibnet.ac.in", external: true },
  { label: "Virtual Labs", href: "https://www.vlab.co.in", external: true },
  { label: "National Scholarship Portal", href: "https://scholarships.gov.in", external: true },
  { label: "Bastar University (SMKV)", href: "https://smkvbastar.ac.in", external: true },
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
