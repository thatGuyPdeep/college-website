import { SHORTLIST_COUNT, SHORTLIST_META } from "@/lib/content/admissions-shortlist-first";

export type NoticeTickerItem = {
  message: string;
  href: string;
};

/** Horizontal ticker copy — announcements only (no student names). */
export const NOTICE_TICKER_ITEMS: NoticeTickerItem[] = [
  {
    message: `NEW: 1st List of Shortlisted Students published (${SHORTLIST_META.publishedAt}) — Session ${SHORTLIST_META.session}.`,
    href: SHORTLIST_META.href,
  },
  {
    message: `${SHORTLIST_COUNT} candidates shortlisted across BA, B.Sc Science, B.Sc Life Science, and B.Com. Download the official PDF.`,
    href: SHORTLIST_META.pdfUrl,
  },
  {
    message: "Shortlisted candidates should follow further instructions from the admissions office and Bastar University portal.",
    href: SHORTLIST_META.href,
  },
  {
    message: "Online applications for affiliated UG programmes are submitted at smkvbastar.ac.in.",
    href: "/admissions/apply",
  },
  {
    message: "Admissions enquiries: Ramakrishna Mission Vivekananda College, Narayanpur — 07781-252251.",
    href: "/contact",
  },
];
