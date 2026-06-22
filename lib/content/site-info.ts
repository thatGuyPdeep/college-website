/** Home-page content from Obsidian home.md capture */

export const ABUJHMARH = {
  title: "The Abujhmarh Region",
  paragraphs: [
    "Abujhmarh has a tribal population of about 34,000 inhabiting some 233 far-flung villages over a sprawling area of 4,000 sq. km. It is described as a \"tangled knot of hills\" having an inaccessible terrain that remains absolutely cut off from the rest of the civilized world for about 6 months a year even to this day. The region is about 95 km long from North to South and about 55 km broad from East to West.",
    "The word \"Abujhmarh\" combines Hindi 'Abujh' (unknown) and Gondi 'Marh' (highland). True to its name, it continues to be more or less an unknown and non-surveyed area.",
    "The habitants — the Abujhmaria or Hill Marias — are a Particularly Vulnerable Tribal Group (PVTG) with slash-and-burn cultivation as their mainstay, very low literacy, and centuries of neglect before the Mission arrived.",
  ],
} as const;

export const ARATI_TIMINGS = [
  { period: "01 January – 31 January", time: "6:00 pm" },
  { period: "01 February – 28/29 February", time: "6:15 pm" },
  { period: "01 March – 30 April", time: "6:30 pm" },
  { period: "01 May – 31 August", time: "6:45 pm" },
  { period: "01 September – 19 September", time: "6:30 pm" },
  { period: "20 September – 14 October", time: "6:15 pm" },
  { period: "15 October – 14 November", time: "6:00 pm" },
  { period: "15 November – 31 December", time: "5:45 pm" },
] as const;

export const OPENING_HOURS = {
  office: ["8:30 AM – 12:00 PM", "2:30 PM – 5:30 PM"],
  hospital: [
    "8:30 AM – 1:00 PM",
    "4:00 PM – 6:00 PM (March – September)",
    "3:30 PM – 5:30 PM (October – February)",
  ],
  temple: ["4:45 AM – 12:00 PM", "4:00 PM – 8:00 PM"],
} as const;

export const FESTIVAL_EVENTS = [
  { title: "Swamiji's Tithi Puja", date: "10 Jan 2026", img: "/images/ev-vivekananda-tithi-2024.jpg" },
  { title: "National Youth Day", date: "12 Jan 2026", img: "/images/ev-national-youth-day-2023.jpg" },
  { title: "Parakram Diwas", date: "23 Jan 2026", img: "/images/ev-republic-day-2024.jpg" },
  { title: "Basant Panchami", date: "23 Jan 2026", img: "/images/ev-saraswati-puja-2024.jpg" },
  { title: "Republic Day Celebration", date: "26 Jan 2026", img: "/images/ev-republic-day-2024.jpg" },
  { title: "Maha Shivratri", date: "15 Feb 2026", img: "/images/ev-maha-shivaratri-2024.jpg" },
  { title: "Sri Sri Thakur Tithi Puja", date: "19 Feb 2026", img: "/images/sri-ramakrishna.jpg" },
  { title: "Holika Dahan", date: "2 Mar 2026", img: "/images/ashrama-6.jpg" },
] as const;

export const ASHRAMA_ACTIVITIES = [
  {
    slug: "education",
    title: "Education",
    img: "/images/act-education.jpg",
    desc: "Vivekananda Vidyapeeth and six interior Vidyamandirs — free residential schooling for 2,730+ tribal students.",
    href: "/academics",
  },
  {
    slug: "healthcare",
    title: "Health Care",
    img: "/images/act-healthcare.jpg",
    desc: "30-bed Vivekananda Arogya Dham, mobile medical units and five health posts serving 60,000+ patients yearly.",
    href: "/about/activities#healthcare",
  },
  {
    slug: "rural-development",
    title: "Rural Development (IRP)",
    img: "/images/act-rural.jpg",
    desc: "Agriculture Training & Demonstration Centre at Brehabeda — Kisan Mela, farmer training and tribal livelihood.",
    href: "/about/activities#rural",
  },
  {
    slug: "iti",
    title: "Industrial Training Institute",
    img: "/images/act-iti.jpg",
    desc: "NCVT-affiliated ITI with 10 trades — free vocational training for 400+ tribal youth.",
    href: "/academics/iti",
  },
  {
    slug: "coaching",
    title: "Free Coaching Center",
    img: "/images/act-coaching.jpg",
    desc: "Free coaching for competitive exams and supplementary education for tribal students.",
    href: "/about/activities#coaching",
  },
  {
    slug: "ancillary",
    title: "Ancillary Units",
    img: "/images/act-ancillary.jpg",
    desc: "Self-help and income-generation units supporting the Ashrama's welfare activities.",
    href: "/about/activities#ancillary",
  },
  {
    slug: "sports",
    title: "Sports",
    img: "/images/act-sports.jpg",
    desc: "Kho-Kho, football, gymnastics, athletics and annual sports meet for 2,000+ tribal students.",
    href: "/about/activities#sports",
  },
  {
    slug: "vishwas",
    title: "VISHWAS",
    img: "/images/act-vishwas.jpg",
    desc: "Vivekananda Institute for Social Welfare and Social Action — community outreach programmes.",
    href: "/about/activities#vishwas",
  },
] as const;

export const SERVICE_TAGLINE =
  "All these activities are conducted as service, service to God in man.";
