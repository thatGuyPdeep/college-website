export type CellDocument = { label: string; href: string; external?: boolean };
export type CellDetail = {
  responsibilities: string[];
  documents?: CellDocument[];
  helpline?: string;
  members?: string[];
  extra?: string;
};

export const STATUTORY_CELL_DETAILS: Record<string, CellDetail> = {
  rti: {
    responsibilities: [
      "Receive and process applications under the Right to Information Act, 2005",
      "Provide certified copies of non-exempt records within statutory timelines",
      "Coordinate appeals with the Appellate Authority",
    ],
    documents: [
      { label: "RTI Application Form", href: "/forms" },
      { label: "RTI Cell — full page", href: "/rti" },
      { label: "Mandatory Disclosure", href: "/disclosure" },
    ],
    members: ["Public Information Officer — College Office", "Appellate Authority — Secretary, Mission Ashrama"],
  },
  "anti-ragging": {
    responsibilities: [
      "Monitor compliance with UGC Anti-Ragging Regulations",
      "Collect anti-ragging affidavits from students and parents at admission",
      "Investigate complaints and coordinate with university authorities",
    ],
    helpline: "National Anti-Ragging Helpline: 1800-180-5522 (24×7) · helpline@antiragging.in",
    documents: [
      { label: "Anti-Ragging Affidavit", href: "/forms#anti-ragging" },
      { label: "UGC Anti-Ragging Regulations", href: "https://www.ugc.gov.in/antiragging/", external: true },
    ],
    members: ["Anti-Ragging Committee — chaired by Principal", "Nodal Officer — College Office"],
  },
  icc: {
    responsibilities: [
      "Receive complaints of sexual harassment at workplace under the POSH Act",
      "Conduct inquiry in a time-bound, confidential manner",
      "Recommend corrective action to the management",
    ],
    documents: [{ label: "ICC Policy & Contact", href: "/cells/icc" }],
    members: ["Presiding Officer (senior woman faculty/staff)", "Two faculty members", "One external member from NGO/legal background"],
    extra: "Complaints may be submitted in writing to rkm.narainpur@gmail.com marked Confidential — ICC.",
  },
  sgrc: {
    responsibilities: [
      "Redress academic, examination, hostel, and service-related grievances of students",
      "Maintain a register of complaints and resolutions",
      "Escalate unresolved matters to the Principal / Secretary",
    ],
    documents: [{ label: "Grievance Form", href: "/contact?subject=Student%20Grievance" }],
    members: ["SGRC Chair — Faculty nominee", "Student representatives", "Administrative nominee"],
  },
  "women-cell": {
    responsibilities: [
      "Programmes for women students — health, safety, and leadership",
      "Counselling support and referral to ICC where required",
      "Awareness on gender equity and POSH",
    ],
    members: ["Women Cell Coordinator — faculty", "Counsellor nominee", "Student volunteers"],
  },
  "sc-st-cell": {
    responsibilities: [
      "Guide SC/ST students on government scholarships and reservation policy",
      "Address discrimination complaints and academic support needs",
      "Coordinate with Bastar University SC/ST cell",
    ],
    documents: [
      { label: "Scholarships", href: "/admissions/scholarships" },
      { label: "Contact for SC/ST support", href: "/contact?subject=SC%2FST%20Cell" },
    ],
  },
  "minority-cell": {
    responsibilities: [
      "Support minority-community students under UGC guidelines",
      "Facilitate scholarship and welfare scheme information",
    ],
    documents: [{ label: "Enquiry", href: "/contact?subject=Minority%20Cell" }],
  },
  "ugc-cell": {
    responsibilities: [
      "UGC scheme notifications and compliance reporting",
      "Mandatory disclosure and AISHE coordination",
    ],
    documents: [
      { label: "Mandatory Disclosure", href: "/disclosure" },
      { label: "UGC Portal", href: "https://www.ugc.gov.in", external: true },
    ],
  },
  iqac: {
    responsibilities: [
      "Quality benchmarks, AQAR preparation, and NAAC documentation",
      "Stakeholder feedback collection and analysis",
    ],
    documents: [
      { label: "IQAC Home", href: "/iqac" },
      { label: "Feedback Form", href: "/iqac#feedback" },
    ],
  },
  "it-cell": {
    responsibilities: [
      "Website, student/faculty portals, and ICT lab support",
      "Data backup and cyber hygiene awareness",
    ],
    members: ["IT Coordinator — faculty/staff", "Technical support — Mission Ashrama"],
  },
  aishe: {
    responsibilities: ["Submit annual AISHE data to the Ministry of Education", "Coordinate with university for consolidated returns"],
    documents: [{ label: "AISHE Portal", href: "https://aishe.gov.in", external: true }],
  },
  rusa: {
    responsibilities: ["Implement RUSA-funded quality enhancement activities where applicable", "Maintain utilization and progress reports"],
  },
  "state-planning": {
    responsibilities: ["State higher-education plan proposals and scheme coordination with Chhattisgarh department"],
  },
  "research-promotion": {
    responsibilities: [
      "Faculty research guidance and seminar organization",
      "Maintain research activity records for IQAC/NAAC",
    ],
    documents: [
      { label: "Research Overview", href: "/research" },
      { label: "Facilities & Labs", href: "/research/facilities" },
    ],
  },
  "women-empowerment": {
    responsibilities: ["Self-defence, health camps, and leadership workshops for women students", "Collaboration with Women Cell and NSS"],
  },
  "women-employees-complaint": {
    responsibilities: ["Workplace grievance redressal for women employees under institutional policy", "Liaison with ICC for overlapping matters"],
    extra: "Employees may write to rkm.narainpur@gmail.com marked Confidential — Women Employees Complaint Cell.",
  },
};

export function getCellDetail(slug: string): CellDetail | null {
  return STATUTORY_CELL_DETAILS[slug] ?? null;
}
