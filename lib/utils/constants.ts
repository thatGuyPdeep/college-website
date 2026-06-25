export const SITE_NAME = "RKM Vivekananda College Narayanpur";
export const SITE_SHORT_NAME = "RMVK College";
export const SITE_FULL_NAME = "Ramakrishna Mission Vivekananda College";
export const SITE_HINDI_NAME = "रामकृष्ण मिशन विवेकानन्द कॉलेज";
/** College name with city — for letters, PDFs, emails */
export const SITE_COLLEGE_LINE = `${SITE_FULL_NAME}, Narayanpur`;
export const SITE_LOCATION = "Narayanpur, Chhattisgarh";
export const SITE_TAGLINE = "आत्मनो मोक्षार्थं जगद्धिताय च";
export const SITE_TAGLINE_EN = "For one's own salvation and for the welfare of the world";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const RKM_LOGO_URL = "/rkm-logo.png";
/** Legacy SVG fallback */
export const RKM_EMBLEM_URL = "/rkm-logo.png";

export const RKM_FACTS = {
  founded: "2 August 1985",
  parent_body: "Ramakrishna Mission Ashrama, Narainpur",
  secretary: "Swami Vyaptananda",
  affiliation: "Belur Math, Ramakrishna Math & Ramakrishna Mission",
  university: "Shaheed Mahendra Karma Vishwavidyalaya (Bastar University), Jagdalpur",
  area_served: "Narayanpur District, Abujhmarh, Chhattisgarh",
  motto_sanskrit: "आत्मनो मोक्षार्थं जगद्धिताय च",
  motto_english: "For one's own salvation and for the welfare of the world",
  award: "Indira Gandhi National Integration Award (2009)",
};

export const NAV_LINKS = [
  { label: "About", href: "/about", children: [
    { label: "About the College", href: "/about" },
    { label: "History",           href: "/about/history" },
    { label: "Milestones",        href: "/about/milestones" },
    { label: "Vision & Mission",  href: "/vision-mission" },
    { label: "Leadership",        href: "/about#leadership" },
    { label: "Governance",        href: "/about/governance" },
    { label: "Organization",      href: "/about/organization" },
    { label: "Policies",          href: "/policies" },
    { label: "Awards",            href: "/about/awards" },
    { label: "Service Activities", href: "/about/activities" },
    { label: "Mandatory Disclosure", href: "/disclosure" },
    { label: "IQAC",              href: "/iqac" },
    { label: "Our Inspiration",   href: "/about/inspiration/sri-ramakrishna" },
  ]},
  { label: "Academics", href: "/academics", children: [
    { label: "Programmes (FYUGP)", href: "/academics" },
    { label: "Syllabus",             href: "/academics/syllabus" },
    { label: "Academic Calendar",    href: "/academics/calendar" },
    { label: "Study Material",       href: "/study-material" },
    { label: "Departments",        href: "/academics/departments" },
    { label: "NEP 2020",           href: "/nep-2020" },
    { label: "ITI & Vocational",   href: "/academics/iti" },
    { label: "Faculty",            href: "/faculty" },
    { label: "Placements",         href: "/placements" },
  ]},
  { label: "Facilities", href: "/campus/infrastructure", children: [
    { label: "Infrastructure",   href: "/campus/infrastructure" },
    { label: "Sports",           href: "/campus/sports" },
    { label: "Library",          href: "/campus/library" },
    { label: "E-Resources",      href: "/campus/library/e-resources" },
    { label: "Hostel",           href: "/campus/hostel" },
    { label: "Gallery",          href: "/gallery" },
    { label: "Alumni",           href: "/alumni" },
  ]},
  { label: "Admission", href: "/admissions", children: [
    { label: "Overview",          href: "/admissions" },
    { label: "Seats Availability", href: "/admissions/seats" },
    { label: "How to Apply",      href: "/admissions/how-to-apply" },
    { label: "Fee Structure",     href: "/admissions/fees" },
    { label: "Scholarships",      href: "/admissions/scholarships" },
    { label: "Apply Online",      href: "/admissions/apply" },
    { label: "Track Application", href: "/admissions/dashboard" },
  ]},
  { label: "Examination", href: "/examination", children: [
    { label: "Examination Home",  href: "/examination" },
    { label: "Notices",           href: "/examination/notices" },
    { label: "Enrollment",        href: "/examination/enrollment" },
    { label: "Forms",             href: "/examination/forms" },
    { label: "Time Tables",       href: "/examination/timetables" },
    { label: "Results",           href: "/examination/results" },
    { label: "Merit Lists",       href: "/examination/merit" },
    { label: "Revaluation",       href: "/examination/revaluation" },
    { label: "Admit Card",        href: "/examination/admit-card" },
    { label: "Helpline",          href: "/examination/helpline" },
  ]},
  { label: "Media", href: "/news", children: [
    { label: "News & Notices",    href: "/news" },
    { label: "Events",            href: "/events" },
    { label: "Photo Gallery",     href: "/gallery" },
    { label: "Videos",            href: "/gallery#videos" },
    { label: "Press Releases",    href: "/news?category=Notice" },
    { label: "Newsletter (RSS)",  href: "/news/feed" },
    { label: "Annual Report",     href: "/disclosure" },
  ]},
  { label: "Career", href: "/careers", children: [
    { label: "Vacancies",          href: "/careers" },
    { label: "Recruitment Portal", href: "/careers/dashboard" },
    { label: "Forms & Guidelines", href: "/forms" },
  ]},
  { label: "Students", href: "/students-corner", children: [
    { label: "Students' Corner",  href: "/students-corner" },
    { label: "Student ERP Login", href: "/login?redirect=/student" },
    { label: "Study Material",    href: "/study-material" },
    { label: "NSS",               href: "/nss" },
    { label: "Hostel",            href: "/campus/hostel" },
    { label: "Anti-Ragging",      href: "/cells/anti-ragging" },
    { label: "Alumni",            href: "/alumni" },
  ]},
  { label: "Cells", href: "/cells", children: [
    { label: "All Statutory Cells", href: "/cells" },
    { label: "RTI Cell",          href: "/rti" },
    { label: "Anti-Ragging",      href: "/cells/anti-ragging" },
    { label: "Grievance (SGRC)",  href: "/cells/sgrc" },
    { label: "Women Cell",        href: "/cells/women-cell" },
    { label: "SC & ST Cell",      href: "/cells/sc-st-cell" },
    { label: "AISHE Cell",        href: "/cells/aishe" },
    { label: "RUSA Cell",         href: "/cells/rusa" },
    { label: "Research Promotion", href: "/cells/research-promotion" },
    { label: "Women Empowerment", href: "/cells/women-empowerment" },
  ]},
] as const;

export const APPLICATION_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:        { label: "Draft",        color: "secondary"   },
  submitted:    { label: "Submitted",    color: "info"        },
  under_review: { label: "Under Review", color: "warning"     },
  approved:     { label: "Approved",     color: "success"     },
  rejected:     { label: "Rejected",     color: "destructive" },
};

export const DOCUMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "warning"     },
  submitted: { label: "Submitted", color: "info"        },
  approved:  { label: "Approved",  color: "success"     },
  rejected:  { label: "Rejected",  color: "destructive" },
};

export const PROGRAM_LEVELS: Record<string, string> = {
  ug:      "Undergraduate (UG)",
  pg:      "Postgraduate (PG)",
  diploma: "Diploma",
  phd:     "Ph.D.",
};

export const STUDY_MODES: Record<string, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  odl:       "Online / Distance (ODL)",
};

export const REQUIRED_DOCUMENTS = [
  { type: "10th_marksheet",  label: "10th Marksheet"         },
  { type: "12th_marksheet",  label: "12th Marksheet"         },
  { type: "id_proof",        label: "ID Proof (Aadhaar/PAN)" },
  { type: "photo",           label: "Passport-size Photo"    },
  { type: "transfer_cert",   label: "Transfer Certificate"   },
];

export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const STATS = [
  { value: "2,730+", label: "Students in Free Education"   },
  { value: "400+",   label: "Free ITI Trainees"            },
  { value: "60,938", label: "Patients Treated (OPD/IPD)"   },
  { value: "16,688", label: "Mobile Unit Patients"         },
];

export const ACCREDITATION_ITEMS = [
  { name: "Bastar University", description: "Affiliated to Shaheed Mahendra Karma Vishwavidyalaya, Bastar" },
  { name: "NEP 2020",         description: "Four-Year Undergraduate Programme (FYUGP)"                    },
  { name: "Belur Math",       description: "A Branch Centre of Ramakrishna Math & Ramakrishna Mission"    },
  { name: "NCVT",             description: "ITI affiliated to National Council for Vocational Training"   },
];

export const VIVEKANANDA_QUOTES = [
  {
    quote: "Arise, awake and stop not till the goal is reached.",
    attribution: "Swami Vivekananda",
  },
  {
    quote: "He who sees Shiva in the poor, in the weak, and in the diseased, really worships Shiva.",
    attribution: "Swami Vivekananda",
  },
  {
    quote: "If the poor cannot come to education, education must go to them.",
    attribution: "Swami Vivekananda",
  },
];

/* ──────────────────────────────────────────────────────────────────
 * Real institutional data — sourced from the Ramakrishna Mission
 * Narainpur site (narainpur.rkmm.org) and the Bastar University
 * NEP-2020 FYUGP syllabus 2024-28. See the extracted content library.
 * ────────────────────────────────────────────────────────────────── */

/** Undergraduate programmes (NEP 2020 FYUGP, affiliated to Bastar University) */
export const PROGRAMS = [
  {
    name: "B.Com — Commerce",
    level: "ug",
    dept: "Commerce",
    mode: "full_time",
    duration: "4 years (FYUGP)",
    slug: "bcom",
    short: "Accounting, business law, economics, taxation, management, finance & marketing electives.",
    highlights: ["Certificate exit after Sem II", "Diploma exit after Sem IV", "Electives: Management · Finance · Marketing"],
  },
  {
    name: "B.Sc — Computer Science",
    level: "ug",
    dept: "Computer Science",
    mode: "full_time",
    duration: "4 years (FYUGP)",
    slug: "bsc-cs",
    short: "C++, Java, Python, DBMS, web technology, AI/ML, IoT, cyber security & a major project.",
    highlights: ["C++ · Java · Python", "AI/ML, IoT, Cloud, Cyber Security", "Major Project in final year"],
  },
  {
    name: "B.A. — Economics",
    level: "ug",
    dept: "Economics",
    mode: "full_time",
    duration: "4 years (FYUGP)",
    slug: "ba-economics",
    short: "Micro & macroeconomics, Indian economy, econometrics, development economics, and public finance.",
    highlights: ["Quantitative & applied economics", "Chhattisgarh & tribal development focus", "NEP 2020 flexible exits"],
  },
  {
    name: "B.P.Ed. — Sports Education",
    level: "ug",
    dept: "Physical Education",
    mode: "full_time",
    duration: "4 years (FYUGP)",
    slug: "bped",
    short: "Physical education, sports science, coaching methodology, and fitness training under NEP 2020.",
    highlights: ["Sports coaching & training", "Indoor stadium & grounds on campus", "Rajya Khel Alankaran award-winning sports programme"],
  },
] as const;

/** ITI trades — Ramakrishna Mission ITI, Narayanpur (NCVT affiliated) */
export const ITI_TRADES = [
  { name: "Electrician",        duration: "2 Years", eligibility: "10th with Maths & Science" },
  { name: "Draughtsman Civil",  duration: "2 Years", eligibility: "10th with Maths & Science" },
  { name: "Fitter",             duration: "2 Years", eligibility: "10th with Maths & Science" },
  { name: "Turner",             duration: "2 Years", eligibility: "10th with Maths & Science" },
  { name: "Wireman",            duration: "2 Years", eligibility: "10th Pass" },
  { name: "COPA (Computer Operator & Programming Assistant)", duration: "1 Year", eligibility: "10th Pass" },
  { name: "Mason",              duration: "1 Year",  eligibility: "10th Pass" },
  { name: "Welder",             duration: "1 Year",  eligibility: "10th Pass" },
  { name: "Mechanic Diesel",    duration: "1 Year",  eligibility: "10th with Maths & Science" },
  { name: "Mechanic Tractor",   duration: "1 Year",  eligibility: "10th Pass" },
] as const;

/** Vivekananda Vidyapeeth — higher-secondary streams (Class 11–12) */
export const SCHOOL_STREAMS = ["Science", "Commerce", "Arts", "Agriculture", "Home Science"] as const;

/** Chhattisgarh Board results — Vivekananda Vidyapeeth */
export const BOARD_RESULTS = [
  { year: "2020-21", cls: "X",   appeared: 145, passed: 145, percent: "100%" },
  { year: "2020-21", cls: "XII", appeared: 140, passed: 140, percent: "100%" },
  { year: "2019-20", cls: "X",   appeared: 154, passed: 152, percent: "98.7%" },
  { year: "2019-20", cls: "XII", appeared: 133, passed: 131, percent: "98.5%" },
] as const;

/** Key milestones (1985–2018) — abridged from the Mission's record */
export const MILESTONES = [
  { year: "1985", event: "Ramakrishna Mission Ashrama, Narainpur established as a branch centre of Belur Math; 42 acres received on lease; work begins in a shed on campus." },
  { year: "1986", event: "Vivekananda Vidyapeeth and the Tribal Youth Training Centre started; Hospital (OPD) and Mobile Dispensary inaugurated." },
  { year: "1989", event: "Indoor Hospital inaugurated, expanding free healthcare for the Abujhmaria tribal community." },
  { year: "1990", event: "Agriculture Training & Demonstration Centre established at Brehabeda for scientific farming." },
  { year: "2005", event: "New Universal Temple of Sri Ramakrishna inaugurated on campus." },
  { year: "2010", event: "Swami Vivekananda Educational Complex inaugurated by the Chief Minister of Chhattisgarh." },
  { year: "2012", event: "Ramakrishna Mission Industrial Training Institute (ITI) started at Narainpur." },
  { year: "2015", event: "ITI affiliated to NCVT; Model Residential Higher Secondary School inaugurated." },
  { year: "2016", event: "Infosys Semi-Open Auditorium cum Indoor Stadium inaugurated." },
  { year: "2018", event: "All India Tribal Youth Convention hosted — 2,500 youths from 14 states participated." },
] as const;

/** National & state awards conferred on the Mission */
export const AWARDS = [
  { year: "1996", name: "Bhagwan Mahaveer Foundation Award for Excellence in Social Service" },
  { year: "1998", name: "Indira Gandhi Social Service Award (1995-96)" },
  { year: "2000", name: "Dr. Ambedkar National Award (President of India, Rashtrapati Bhavan)" },
  { year: "2001", name: "Martyr Veer Narayan Singh Award, Government of Chhattisgarh" },
  { year: "2002", name: "Pt. Ravi Shankar Shukla Award for Communal Harmony" },
  { year: "2009", name: "Indira Gandhi National Integration Award" },
  { year: "2010", name: "Bhilai Mitra Puraskar" },
  { year: "2018", name: "Rajya Khel Alankaran Puraskar (sports training in tribal areas)" },
  { year: "2021", name: "Yati Yatanlal Sanman (Ahimsa & Go-raksha)" },
] as const;

import { LEADERSHIP_PROFILES } from "@/lib/content/leadership-profiles";

/** Ashrama leadership — UGC disclosure requirement (static fallback; CMS overrides via leadership_entries) */
export const LEADERSHIP = LEADERSHIP_PROFILES.map((p) => ({
  slug:  p.slug,
  name:  p.name,
  title: p.title,
  body:  p.body,
  image: p.image,
}));

/** News & events — festival calendar + notices (drive from CMS later) */
export const NEWS_EVENTS = [
  {
    title: "Admissions Open for Session 2026–27",
    slug: "admissions-2026-27",
    date: "1 May 2026",
    category: "Admissions",
    img: "/images/school-1.jpg",
    excerpt: "Applications invited for UG (FYUGP) programmes and NCVT-affiliated ITI trades. 80 unique applicants received so far for session 2026–27.",
    attachmentUrl: "/admissions/apply",
    attachmentLabel: "Apply Online",
    language: "EN",
  },
  {
    title: "प्रवेश सूचना 2026–27 — स्नातक (FYUGP) कार्यक्रम",
    slug: "admissions-notice-hi-2026-27",
    date: "1 May 2026",
    category: "Notice",
    img: "/images/school-1.jpg",
    excerpt: "नारायणपुर रामकृष्ण मिशन विवेकानन्द कॉलेज में सत्र 2026–27 हेतु स्नातक (FYUGP) कार्यक्रमों में ऑनलाइन प्रवेश आवेदन आमंत्रित।",
    attachmentUrl: "/admissions/apply",
    attachmentLabel: "ऑनलाइन आवेदन",
    language: "HI",
  },
  {
    title: "ITI Admission — Sessions 2026–27 & 2026–28",
    slug: "iti-admission-2026-27",
    date: "29 May – 1 Jul 2026",
    category: "Admissions",
    img: "/images/act-iti.jpg",
    excerpt: "Applications open for ITI trades. Institute open on Saturdays for form submission. Priority for Abujhmaria tribal youth.",
    attachmentUrl: "/academics/iti",
    attachmentLabel: "ITI Details",
    language: "EN",
  },
  {
    title: "Odd Semester Examination — schedule notification",
    slug: "odd-sem-exam-schedule-2026",
    date: "Nov 2026",
    category: "Notice",
    img: "/images/school-2.jpg",
    excerpt: "End-semester examinations for Odd Semester (Sem I / III / V / VII) as per Bastar University calendar.",
    attachmentUrl: "/examination/timetables",
    attachmentLabel: "Time Tables",
    language: "EN",
  },
  {
    title: "Staff Nurse (NRHM) Selection List Published",
    slug: "staff-nurse-nrhm-selection-2026",
    date: "2026",
    category: "Notice",
    img: "/images/act-healthcare.jpg",
    excerpt: "Press release and selection list for the Staff Nurse (NRHM) recruitment at Vivekananda Arogya Dham.",
    attachmentUrl: "https://narainpur.rkmm.org",
    attachmentLabel: "View Press Release",
    attachmentSize: "Web",
    language: "EN",
  },
  {
    title: "X-Ray Technician — Daily Wages Vacancy",
    slug: "xray-technician-vacancy-2026",
    date: "Until 30 May 2026",
    category: "Notice",
    img: "/images/act-healthcare.jpg",
    excerpt: "Application invited for X-Ray Technician on daily-wages basis. Last date for applying is 30th May 2026.",
    attachmentUrl: "/careers",
    attachmentLabel: "View Vacancy",
    language: "EN",
  },
  {
    title: "दैनिक वेतन आधार पर एक्स-रे तकनीशियन — आवेदन आमंत्रित",
    slug: "xray-technician-vacancy-2026-hi",
    date: "30 मई 2026 तक",
    category: "Notice",
    img: "/images/act-healthcare.jpg",
    excerpt: "दैनिक वेतन आधार पर एक्स-रे तकनीशियन के पद के लिए आवेदन आमंत्रित।",
    attachmentUrl: "/careers",
    attachmentLabel: "आवेदन देखें",
    language: "HI",
  },
  { title: "Swamiji's Tithi Puja", slug: "swamiji-tithi-puja-2026", date: "10 Jan 2026", category: "Event", img: "/images/ev-vivekananda-tithi-2024.jpg", excerpt: "Observance of Swami Vivekananda's Tithi Puja at the campus temple." },
  { title: "National Youth Day — Swami Vivekananda Jayanti", slug: "national-youth-day-2026", date: "12 Jan 2026", category: "Event", img: "/images/ev-national-youth-day-2023.jpg", excerpt: "Celebration of Swami Vivekananda's birth anniversary across the Ashrama and interior centres." },
  { title: "Parakram Diwas", slug: "parakram-diwas-2026", date: "23 Jan 2026", category: "Event", img: "/images/ev-republic-day-2024.jpg", excerpt: "Observance of Parakram Diwas at the Ashrama." },
  { title: "Basant Panchami & Saraswati Puja", slug: "basant-panchami-2026", date: "23 Jan 2026", category: "Event", img: "/images/ev-saraswati-puja-2024.jpg", excerpt: "Saraswati Puja celebrated with students of the Vidyapeeth and interior schools." },
  { title: "Republic Day Celebration", slug: "republic-day-2026", date: "26 Jan 2026", category: "Event", img: "/images/ev-republic-day-2024.jpg", excerpt: "Flag hoisting and cultural programme by students of Vivekananda Vidyapeeth." },
  { title: "Maha Shivratri", slug: "maha-shivratri-2026", date: "15 Feb 2026", category: "Event", img: "/images/ev-maha-shivaratri-2024.jpg", excerpt: "Maha Shivratri observance at the Universal Temple of Sri Ramakrishna." },
  { title: "Sri Sri Thakur Tithi Puja", slug: "thakur-tithi-puja-2026", date: "19 Feb 2026", category: "Event", img: "/images/sri-ramakrishna.jpg", excerpt: "Tithi Puja of Sri Ramakrishna at the campus temple." },
  { title: "Holika Dahan", slug: "holika-dahan-2026", date: "2 Mar 2026", category: "Event", img: "/images/ashrama-6.jpg", excerpt: "Holika Dahan celebration on the Ashrama campus." },
] as const;

/** Photo gallery — Google Photos albums by year (from the Mission site) */
export const GALLERY_ALBUMS = [
  { year: "2024", count: 14, href: "https://photos.app.goo.gl/9kHHtSqZgPCgtRHy5" },
  { year: "2023", count: 44, href: "https://photos.app.goo.gl/qFFpkRn8e6fvWb3E6" },
  { year: "2022", count: 33, href: "https://photos.app.goo.gl/QbyKQCYkEum4sbnw8" },
] as const;

/** Curated photos shown directly in the gallery grid */
export const GALLERY_PHOTOS = [
  { src: "/images/ev-republic-day-2024.jpg",      caption: "Republic Day Celebration",        year: "2024" },
  { src: "/images/ev-saraswati-puja-2024.jpg",    caption: "Saraswati Puja",                   year: "2024" },
  { src: "/images/ev-maha-shivaratri-2024.jpg",   caption: "Maha Shivaratri",                  year: "2024" },
  { src: "/images/ev-kisan-mela-2024.jpg",        caption: "Kisan Mela",                       year: "2024" },
  { src: "/images/ev-sail-khel-mela-2024.jpg",    caption: "SAIL Khel Mela",                   year: "2024" },
  { src: "/images/ev-vivekananda-tithi-2024.jpg", caption: "Swami Vivekananda Tithi Puja",     year: "2024" },
  { src: "/images/ev-national-youth-day-2023.jpg",caption: "National Youth Day",               year: "2023" },
  { src: "/images/ev-astroturf-football-2023.jpg",caption: "Astroturf Football Ground Inauguration", year: "2023" },
  { src: "/images/ev-opd-kundla-2023.jpg",        caption: "OPD Building Inauguration, Kundla", year: "2023" },
  { src: "/images/ev-school-kachchapal-2023.jpg", caption: "School Building Inauguration, Kachchapal", year: "2023" },
  { src: "/images/ev-minister-visit-2023.jpg",    caption: "Visit of Sri Mansukh L. Mandaviya", year: "2023" },
  { src: "/images/ev-prabuddha-bharat-2023.jpg",  caption: "Prabuddha Bharat — Drama",         year: "2023" },
] as const;

/** Glimpses of the Ashrama campus */
export const ASHRAMA_GALLERY = [
  "/images/ashrama-1.jpg", "/images/ashrama-2.jpg", "/images/ashrama-3.jpg", "/images/ashrama-4.jpg",
  "/images/ashrama-5.jpg", "/images/ashrama-6.jpg", "/images/ashrama-7.jpg", "/images/ashrama-8.jpg",
] as const;

/** Spiritual inspiration — the Holy Trinity (see /about/inspiration/[slug]) */
export const INSPIRATION = [
  { name: "Sri Ramakrishna",    title: "The Prophet of Harmony",      img: "/images/sri-ramakrishna.jpg",   slug: "sri-ramakrishna" },
  { name: "Sri Sarada Devi",    title: "The Holy Mother",             img: "/images/holy-mother.jpg",       slug: "sri-saradadevi" },
  { name: "Swami Vivekananda",  title: "The Patriot-Saint of India",  img: "/images/swami-vivekananda.jpg", slug: "swami-vivekananda" },
] as const;

export const YOUTUBE_CHANNEL = "https://www.youtube.com/channel/UC4u6Yg-UujEgKLyOi92s16Q";

/** Contact details */
export const CONTACT = {
  org: "Ramakrishna Mission Ashrama, Narainpur",
  address: "Sonpur Road, PO & Dist. Narainpur, Chhattisgarh – 494661, India",
  phones: ["+91-77-81252251", "+91-77-81252393"],
  email: "rkm.narainpur@gmail.com",
  iti_phone: "07781-252360",
  iti_email: "info@rkmitinpr.org",
  office_hours: ["8:30 AM – 12:00 PM", "2:30 PM – 5:30 PM"],
  hospital_hours: [
    "8:30 AM – 1:00 PM",
    "4:00 PM – 6:00 PM (March – September)",
    "3:30 PM – 5:30 PM (October – February)",
  ],
  temple_hours: ["4:45 AM – 12:00 PM", "4:00 PM – 8:00 PM"],
  map_query: "Ramakrishna Mission Ashrama Narayanpur Chhattisgarh",
};

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/vctc.npr",
  instagram: "https://www.instagram.com/rkm_narainpur/",
  twitter: "https://twitter.com/rkmanarainpur/",
  youtube: "https://www.youtube.com/channel/UC4u6Yg-UujEgKLyOi92s16Q",
};

export const EXTERNAL_LINKS = {
  belurMath: "https://belurmath.org",
  iti: "https://rkmitinpr.org",
  onlineReading: "https://publications.rkmm.org",
  missionSite: "https://narainpur.rkmm.org",
  donateOnline: "https://rzp.io/l/T1CTLSzA",
};
