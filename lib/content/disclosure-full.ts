import type { DisclosureSection } from "@/lib/content/public-data";

/** Full UGC/AICTE disclosure structure — merged with DB overrides in getMergedDisclosure() */
export const FULL_DISCLOSURE_SECTIONS: DisclosureSection[] = [
  {
    id: "about", label: "A) About HEI",
    items: [
      { label: "About Us / Overview", href: "/about" },
      { label: "Vision & Mission", href: "/vision-mission" },
      { label: "Affiliating University (Bastar University)", href: "/about" },
      { label: "Mandatory Disclosure (this page)", href: "/disclosure" },
    ],
  },
  {
    id: "administration", label: "B) Administration",
    items: [
      { label: "Leadership & Functionaries", href: "/about#leadership" },
      { label: "Contact & Grievance Redressal", href: "/contact#grievance" },
    ],
  },
  {
    id: "academics", label: "C) Academics",
    items: [
      { label: "List of Academic Programmes", href: "/academics" },
      { label: "Departments / Schools", href: "/academics/departments" },
      { label: "Faculty Details with Photographs", href: "/faculty" },
      { label: "Library", href: "/campus/library" },
    ],
  },
  {
    id: "admissions_fee", label: "D) Admissions & Fee",
    items: [
      { label: "Admissions Overview", href: "/admissions" },
      { label: "How to Apply", href: "/admissions/how-to-apply" },
      { label: "Fee Structure", href: "/admissions/fees" },
      { label: "Scholarships & Reservation", href: "/admissions/scholarships" },
      { label: "Online Application Portal", href: "/admissions/apply" },
      { label: "Track Application", href: "/admissions/dashboard" },
    ],
  },
  {
    id: "research", label: "E) Research",
    items: [
      { label: "R&D at Ramakrishna Mission Ashrama", href: "/about" },
    ],
  },
  {
    id: "student_life", label: "F) Student Life",
    items: [
      { label: "Infrastructure & Sports", href: "/campus/infrastructure" },
      { label: "Hostel Details", href: "/campus/hostel" },
      { label: "Placement Cell", href: "/placements" },
      { label: "Anti-Ragging / Grievance", href: "/contact#grievance" },
    ],
  },
  {
    id: "aicte", label: "G) AICTE / Regulatory",
    items: [
      { label: "Faculty Details – Department-wise", href: "/faculty" },
      { label: "Programme-wise Intake", href: "/academics" },
    ],
  },
];
