import type { PortalLink } from "@/lib/content/reference-portal";

export const POLICY_SECTIONS: { title: string; links: PortalLink[] }[] = [
  {
    title: "Statutory & Regulatory",
    links: [
      { label: "UGC Mandatory Disclosure", href: "/disclosure" },
      { label: "NEP 2020 Implementation", href: "/nep-2020" },
      { label: "RTI Act — Right to Information", href: "/rti" },
      { label: "Anti-Ragging Policy (UGC)", href: "/cells/anti-ragging" },
      { label: "POSH / ICC", href: "/cells/icc" },
      { label: "Bastar University — Affiliating Statutes", href: "https://smkvbastar.ac.in", external: true },
    ],
  },
  {
    title: "Academic Policies",
    links: [
      { label: "Academic Calendar", href: "/academics/calendar" },
      { label: "FYUGP Syllabus 2024–28", href: "/academics/syllabus" },
      { label: "Examination Rules", href: "/examination" },
      { label: "Admission Guidelines", href: "/admissions/how-to-apply" },
      { label: "Fee Structure & Refund", href: "/admissions/fees" },
      { label: "Scholarships & Reservation", href: "/admissions/scholarships" },
    ],
  },
  {
    title: "Student Welfare",
    links: [
      { label: "Students' Corner", href: "/students-corner" },
      { label: "Hostel Rules", href: "/campus/hostel#rules" },
      { label: "Grievance Redressal", href: "/cells/sgrc" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund & Cancellation", href: "/refund" },
    ],
  },
  {
    title: "Reports & Accounts",
    links: [
      { label: "IQAC / AQAR", href: "/iqac" },
      { label: "Annual Report — request", href: "/contact?subject=Annual%20Report" },
      { label: "Audited Accounts — request", href: "/contact?subject=Audited%20Accounts" },
      { label: "FCRA Disclosure", href: "https://narainpur.rkmm.org/fc-disclosure", external: true },
    ],
  },
];
