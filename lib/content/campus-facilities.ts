/** Campus facilities — Ramakrishna Mission Ashrama, Narayanpur (college + ITI + Vidyapeeth). */

export type CampusFacility = {
  name: string;
  hindi?: string;
  description: string;
  href?: string;
};

export const COLLEGE_INFRASTRUCTURE: CampusFacility[] = [
  {
    name: "UG Classrooms (FYUGP)",
    hindi: "स्नातक कक्षाएँ",
    description:
      "Classrooms for NEP 2020 four-year undergraduate programmes affiliated to Bastar University — Commerce, Science, and Humanities streams.",
    href: "/academics",
  },
  {
    name: "Science & Computer Laboratories",
    hindi: "प्रयोगशालाएँ",
    description:
      "Practical labs for Computer Science and allied science programmes, supporting FYUGP coursework and projects.",
    href: "/academics/departments",
  },
  {
    name: "Central Library",
    hindi: "केंद्रीय पुस्तकालय",
    description:
      "Reading room, reference section, and e-resources including INFLIBNET, NDL, and Mission publications.",
    href: "/campus/library",
  },
  {
    name: "ITI Workshops (NCVT)",
    hindi: "आई.टी.आई. कार्यशालाएँ",
    description:
      "Electrician, Fitter, Turner, Welder, COPA and other trade workshops with modern equipment — 2 units, 2 shifts.",
    href: "/academics/iti",
  },
  {
    name: "Hostel & Residential Blocks",
    hindi: "छात्रावास",
    description:
      "Supervised residential facilities for Vidyapeeth, ITI, and eligible college students — spiritual routine and study hours.",
    href: "/campus/hostel",
  },
  {
    name: "Infosys Auditorium & Indoor Stadium",
    hindi: "सभागृह एवं इनडोर स्टेडियम",
    description:
      "Semi-open auditorium cum indoor stadium (2016) for conventions, cultural programmes, and inter-school sports.",
    href: "/campus/sports",
  },
  {
    name: "Sports Grounds & Training",
    hindi: "खेल मैदान",
    description:
      "Football, Kho-Kho, volleyball, gymnastics, Mallakhamb, and athletics — annual meet with 2,000+ tribal students.",
    href: "/campus/sports",
  },
  {
    name: "Universal Temple & Prayer Hall",
    hindi: "मंदिर एवं प्रार्थना कक्ष",
    description:
      "Sri Ramakrishna Universal Temple (2005) and daily prayer — centre of the Ashrama's spiritual life.",
    href: "/about",
  },
  {
    name: "Vivekananda Computer Training Center",
    hindi: "कंप्यूटर प्रशिक्षण केंद्र",
    description: "Computer training for students from Class 6 onwards — project-based learning since 2008.",
    href: "/about/activities#education",
  },
];

export const INFRASTRUCTURE_INTRO =
  "The Narayanpur campus spans 42 acres in the Abujhmarh foothills — integrating the college, ITI, Vivekananda Vidyapeeth, hospital, and rural outreach under one Mission centre since 1985.";
