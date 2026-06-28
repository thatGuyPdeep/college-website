/** IIT-style hub page link grids — Research, People, Administration, Connect */

export const RESEARCH_HUB_LINKS = [
  { label: "Research Overview", href: "/research", description: "Mission-aligned research and extension" },
  { label: "Facilities & Labs", href: "/research/facilities", description: "Library, ICT lab, sports infrastructure" },
  { label: "Research Promotion Cell", href: "/cells/research-promotion", description: "Statutory research cell" },
  { label: "Publications", href: "/campus/library/publications", description: "College & Mission publications" },
  { label: "E-Resources", href: "/campus/library/e-resources", description: "Digital library access" },
] as const;

export const PEOPLE_HUB_SECTIONS = [
  { slug: "faculty", label: "Faculty", href: "/people/faculty", description: "Teaching faculty directory" },
  { slug: "staff", label: "Staff", href: "/people/staff", description: "Administrative & support staff" },
  { slug: "students", label: "Students", href: "/people/students", description: "Student life & ERP access" },
  { slug: "authorities", label: "Authorities", href: "/people/authorities", description: "Leadership & key office bearers" },
] as const;

export const ADMINISTRATION_HUB_LINKS = [
  { label: "Leadership", href: "/about/leadership/secretary", description: "Secretary & college leadership" },
  { label: "Governance", href: "/about/governance", description: "Governing body & policies" },
  { label: "Organization", href: "/about/organization", description: "Organizational structure" },
  { label: "IQAC", href: "/iqac", description: "Internal Quality Assurance Cell" },
  { label: "Mandatory Disclosure", href: "/disclosure", description: "UGC / statutory disclosure" },
  { label: "Policies", href: "/policies", description: "Institutional policies" },
] as const;

export const CONNECT_HUB_LINKS = [
  { label: "Contact Us", href: "/contact", description: "Address, phone, enquiry form" },
  { label: "Noticeboard", href: "/noticeboard", description: "Latest notices & circulars" },
  { label: "Alumni", href: "/alumni", description: "Alumni network" },
  { label: "Donate", href: "/donate", description: "Support the Mission's work" },
  { label: "Tenders", href: "/tenders", description: "Open tenders" },
  { label: "Careers", href: "/careers", description: "Faculty & staff vacancies" },
] as const;

/** Featured campus video — RKM Ashrama Narainpur (YouTube) */
export const HOME_WELCOME_VIDEO_ID = "1ylaFCSEWCc";
