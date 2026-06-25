/** Leadership profiles — UGC disclosure & home spotlight */

export type LeadershipProfile = {
  slug: string;
  name: string;
  title: string;
  titleHi?: string;
  org: string;
  image: string;
  body: string;
  message: string;
};

export const LEADERSHIP_PROFILES: LeadershipProfile[] = [
  {
    slug: "swami-vyaptananda",
    name: "Swami Vyaptananda",
    title: "Secretary",
    titleHi: "सचिव",
    org: "Ramakrishna Mission Ashrama, Narainpur",
    image: "/images/ashrama-1.jpg",
    body: "Head of Ramakrishna Mission Ashrama, Narayanpur — overall administration of education, healthcare, and tribal welfare across Narayanpur and Abujhmarh since the branch centre was established in 1985.",
    message:
      "The work of the Mission in Abujhmarh is service to God in man. Through education, healthcare, and vocational training we seek to awaken the inherent strength of our tribal brothers and sisters — in the spirit of Swami Vivekananda's ideal of man-making education.",
  },
  {
    slug: "principal",
    name: "College Principal",
    title: "Principal",
    titleHi: "प्राचार्य",
    org: "Ramakrishna Mission Vivekananda College, Narayanpur",
    image: "/images/school-1.jpg",
    body: "Academic head of undergraduate (FYUGP) programmes affiliated to Bastar University under NEP 2020. Oversees faculty, examination coordination, and student welfare. (Update name when formally notified for UGC disclosure.)",
    message:
      "Our college combines rigorous academics with value-based education. Students are encouraged to develop character, competence, and compassion — qualities essential for serving society, especially the tribal communities of Bastar. For the current Principal's name, contact the college office.",
  },
  {
    slug: "admissions-office",
    name: "Admissions Office",
    title: "Admissions & Student Services",
    titleHi: "प्रवेश कार्यालय",
    org: "Ramakrishna Mission Vivekananda College, Narayanpur",
    image: "/images/school-2.jpg",
    body: "Single point of contact for UG admissions, ITI trade allotment queries, document verification, and student services.",
    message:
      "rkm.narainpur@gmail.com · 07781-252251 · Narayanpur, Chhattisgarh 494661. Office hours: Mon–Sat 8:30 AM – 12:00 PM, 2:30 – 5:30 PM.",
  },
];

export function getLeadershipBySlug(slug: string): LeadershipProfile | null {
  return LEADERSHIP_PROFILES.find((p) => p.slug === slug) ?? null;
}
