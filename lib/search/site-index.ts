import {
  SITE_FULL_NAME, SITE_LOCATION, PROGRAMS, ITI_TRADES, NEWS_EVENTS,
  NAV_LINKS, REQUIRED_DOCUMENTS, CONTACT, RKM_FACTS,
} from "@/lib/utils/constants";

export interface SearchResult {
  title: string;
  excerpt: string;
  href: string;
  category: "page" | "program" | "news" | "admission" | "faculty";
}

export function buildSiteIndex(): SearchResult[] {
  const pages: SearchResult[] = [
    { title: "Home", excerpt: `${SITE_FULL_NAME}, ${SITE_LOCATION}`, href: "/", category: "page" },
    { title: "About Us", excerpt: "History, leadership, and the Mission's work in Abujhmarh since 1985", href: "/about", category: "page" },
    { title: "Vision & Mission", excerpt: "Ideology, vision, mission and core values of Ramakrishna Mission", href: "/vision-mission", category: "page" },
    { title: "Academics", excerpt: "UG programmes, ITI trades, and FYUGP courses", href: "/academics", category: "page" },
    { title: "Departments", excerpt: "Academic departments at the college", href: "/academics/departments", category: "page" },
    { title: "Faculty Directory", excerpt: "Faculty members with qualifications and specializations", href: "/faculty", category: "faculty" },
    { title: "Infrastructure", excerpt: "Campus facilities, labs, and buildings", href: "/campus/infrastructure", category: "page" },
    { title: "Library", excerpt: "Library resources, timings, and e-resources", href: "/campus/library", category: "page" },
    { title: "Gallery", excerpt: "Photo albums from campus events", href: "/gallery", category: "page" },
    { title: "Placements", excerpt: "Placement statistics and recruiter information", href: "/placements", category: "page" },
    { title: "Syllabus", excerpt: "FYUGP semester-wise syllabus 2024–28", href: "/academics/syllabus", category: "page" },
    { title: "Seats Availability", excerpt: "Programme-wise sanctioned intake and applications received 2026–27", href: "/admissions/seats", category: "admission" },
    { title: "How to Apply", excerpt: "Step-by-step admission application guide", href: "/admissions/how-to-apply", category: "admission" },
    { title: "Fee Structure", excerpt: "Programme fees and refund policy", href: "/admissions/fees", category: "admission" },
    { title: "Scholarships", excerpt: "Government scholarships and reservation policy", href: "/admissions/scholarships", category: "admission" },
    { title: "Admissions — Apply", excerpt: "Online admission application for UG programmes", href: "/admissions/apply", category: "admission" },
    { title: "Track Application", excerpt: "Check your admission application status", href: "/admissions/dashboard", category: "admission" },
    { title: "Faculty Vacancies", excerpt: "Open faculty recruitment positions", href: "/careers", category: "faculty" },
    { title: "Contact", excerpt: `${CONTACT.address} · ${CONTACT.phones[0]}`, href: "/contact", category: "page" },
    { title: "Mandatory Disclosure", excerpt: "UGC/AICTE mandatory public disclosure documents", href: "/disclosure", category: "page" },
    { title: "News & Events", excerpt: "Latest news, notices and campus events", href: "/news", category: "news" },
    { title: "Alumni Portal", excerpt: "Alumni registration and reconnect with the college", href: "/alumni", category: "page" },
    { title: "NSS", excerpt: "National Service Scheme community outreach", href: "/nss", category: "page" },
    { title: "Study Material", excerpt: "Syllabus, e-learning portals, and question papers", href: "/study-material", category: "page" },
    { title: "Governance", excerpt: "Governing body and academic council", href: "/about/governance", category: "page" },
    { title: "Policies & Guidelines", excerpt: "Statutory and academic policies", href: "/policies", category: "page" },
    { title: "Sports", excerpt: "Sports training and annual meet", href: "/campus/sports", category: "page" },
    { title: "Organizational Structure", excerpt: "Leadership hierarchy and academic units", href: "/about/organization", category: "page" },
    { title: "Examination Helpline", excerpt: "Examination control room contact and hours", href: "/examination/helpline", category: "page" },
    { title: "Examination Portal", excerpt: "Notices, results, timetables, and forms", href: "/examination", category: "page" },
    { title: "IQAC", excerpt: "Internal Quality Assurance Cell", href: "/iqac", category: "page" },
    { title: "Statutory Cells", excerpt: "RTI, anti-ragging, grievance, and welfare cells", href: "/cells", category: "page" },
  ];

  for (const link of NAV_LINKS) {
    if ("children" in link && link.children) {
      for (const child of link.children) {
        if (!pages.some((p) => p.href === child.href)) {
          pages.push({ title: child.label, excerpt: link.label, href: child.href, category: "page" });
        }
      }
    }
  }

  const programs = PROGRAMS.map((p) => ({
    title:       p.name,
    excerpt:     p.short,
    href:        `/academics/courses/${p.slug}`,
    category:    "program" as const,
  }));

  const iti = ITI_TRADES.map((t) => ({
    title:    `ITI — ${t.name}`,
    excerpt:  `${t.duration} · ${t.eligibility}`,
    href:     "/academics#iti",
    category: "program" as const,
  }));

  const news = NEWS_EVENTS.map((n) => ({
    title:    n.title,
    excerpt:  n.excerpt,
    href:     `/news/${n.slug}`,
    category: "news" as const,
  }));

  const admissionDocs = REQUIRED_DOCUMENTS.map((d) => ({
    title:    `Required Document: ${d.label}`,
    excerpt:  "Document required for admission application",
    href:     "/admissions/apply",
    category: "admission" as const,
  }));

  const facts = [
    { title: "Affiliation", excerpt: RKM_FACTS.university, href: "/about", category: "page" as const },
    { title: "Founded", excerpt: RKM_FACTS.founded, href: "/about", category: "page" as const },
  ];

  return [...pages, ...programs, ...iti, ...news, ...admissionDocs, ...facts];
}

export function searchSite(query: string, category?: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  let results = buildSiteIndex().filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q)
  );
  if (category && category !== "all") {
    results = results.filter((r) => r.category === category);
  }
  return results.slice(0, 20);
}
