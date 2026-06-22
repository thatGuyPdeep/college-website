import { SITE_FULL_NAME, SITE_LOCATION, PROGRAMS, REQUIRED_DOCUMENTS, CONTACT, RKM_FACTS } from "@/lib/utils/constants";

export const KNOWLEDGE_BASE = [
  {
    title: "About the College",
    source: "/about",
    text: `${SITE_FULL_NAME}, ${SITE_LOCATION}, is a branch centre of Ramakrishna Math & Ramakrishna Mission, Belur Math, established ${RKM_FACTS.founded}. It serves the Abujhmaria tribal community in Narayanpur district. Affiliated to ${RKM_FACTS.university}. Motto: ${RKM_FACTS.motto_english}.`,
  },
  {
    title: "How to Apply",
    source: "/admissions/apply",
    text: `Admission is online via the 5-step wizard: Personal details, Academic records, Programme choice, Document upload, Review & Submit. Sign in with email OTP at /login. Save and resume anytime. Application number format: RKM-YYYY-XXXXX.`,
  },
  {
    title: "Required Documents",
    source: "/admissions/apply",
    text: REQUIRED_DOCUMENTS.map((d) => d.label).join(", ") + ". Accepted formats: PDF, JPG, PNG. Maximum 5 MB per file.",
  },
  {
    title: "Programmes Offered",
    source: "/academics",
    text: PROGRAMS.map((p) => `${p.name} (${p.duration}): ${p.short}`).join(" "),
  },
  {
    title: "Contact",
    source: "/contact",
    text: `Address: ${CONTACT.address}. Phone: ${CONTACT.phones.join(", ")}. Email: ${CONTACT.email}. Office hours: ${CONTACT.office_hours.join(", ")}.`,
  },
  {
    title: "Faculty Recruitment",
    source: "/careers",
    text: `Faculty vacancies are listed at /careers. Apply online with CV and certificates. Track applications at /careers/dashboard.`,
  },
  {
    title: "Mandatory Disclosure",
    source: "/disclosure",
    text: `UGC/AICTE mandatory disclosure documents including accreditation, annual reports, fee structure, and anti-ragging policy are published at /disclosure.`,
  },
];
