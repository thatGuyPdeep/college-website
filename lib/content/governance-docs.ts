/** Governance & regulatory document links for mandatory disclosure */

export type GovernanceDoc = {
  label: string;
  href: string;
  external?: boolean;
  category: "regulatory" | "institutional" | "report";
};

export const GOVERNANCE_DOCUMENTS: GovernanceDoc[] = [
  {
    label: "Bastar University (Affiliating University)",
    href: "https://smkvbastar.ac.in",
    external: true,
    category: "regulatory",
  },
  {
    label: "Chhattisgarh Higher Education Department",
    href: "https://highereducation.cg.gov.in",
    external: true,
    category: "regulatory",
  },
  {
    label: "UGC — University Grants Commission",
    href: "https://www.ugc.gov.in",
    external: true,
    category: "regulatory",
  },
  {
    label: "NAAC — Accreditation",
    href: "https://www.naac.gov.in",
    external: true,
    category: "regulatory",
  },
  {
    label: "NEP 2020 Policy",
    href: "/nep-2020",
    category: "regulatory",
  },
  {
    label: "Academic Calendar 2026–27",
    href: "/academics/calendar",
    category: "institutional",
  },
  {
    label: "UG Syllabus (FYUGP 2024–28)",
    href: "/academics/syllabus",
    category: "institutional",
  },
  {
    label: "Seats Availability",
    href: "/admissions/seats",
    category: "institutional",
  },
  {
    label: "Annual Report — request from office",
    href: "/contact?subject=Annual%20Report%20Request",
    category: "report",
  },
  {
    label: "Audited Accounts — request from office",
    href: "/contact?subject=Audited%20Accounts%20Request",
    category: "report",
  },
  {
    label: "FCRA / Foreign Contribution Disclosure",
    href: "https://narainpur.rkmm.org/fc-disclosure",
    external: true,
    category: "report",
  },
];
