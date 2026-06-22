/** Ashrama service activities — from Obsidian activities-*.md */

export type ActivitySection = {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
};

export const ACTIVITY_SECTIONS: ActivitySection[] = [
  {
    id:       "education",
    title:    "Education",
    summary:  "Free residential schooling and value-based education for tribal students across Narayanpur and six interior centres in Abujhmarh.",
    highlights: [
      "Ramakrishna Mission Vivekananda Vidyapeeth — residential school (Class 1–12) with 2,498+ students, 75%+ from the Maria (PVTG) community",
      "Six free residential Vivekananda Vidyamandirs in interior Abujhmarh (Akabeda, Kutul, Kachchapal, Irakbhatti, Kundla, Orchha) — 1,351 students",
      "Vivekananda Computer Training Center and modern science laboratories",
      "Chhattisgarh Board results consistently near 100% pass rate in recent years",
      "Ramakrishna Mission College offers UG (FYUGP) programmes affiliated to Bastar University",
    ],
  },
  {
    id:       "healthcare",
    title:    "Healthcare",
    summary:  "Free medical care for tribals through the hospital, mobile units, and interior health posts.",
    highlights: [
      "Vivekananda Arogya Dham — 30-bed hospital with OPD, inpatient, lab, X-ray, sonography, OT, dental, physiotherapy, and blood bank",
      "Vivekananda Chal Chikitsalaya — mobile medical unit serving ~100 interior villages since 1986",
      "Five health posts inside Abujhmarh (Kundla, Akabeda, Irakbhatti, Kachhapal, Kutul)",
      "Most beneficiaries are tribals treated free of cost including surgery when required",
    ],
  },
  {
    id:       "rural",
    title:    "Integrated Rural Development",
    summary:  "Agriculture training, vocational skills, and livelihood programmes for tribal farmers.",
    highlights: [
      "Agriculture Training & Demonstration Centre at Brehabeda (52 acres, since 1990)",
      "Need-based residential farmer training — free boarding and learning-by-doing",
      "Demonstrations: SRI paddy, vermicompost, mixed fishery, poultry, kitchen gardens",
      "Kisan Mela, Farmers Day, and monthly farmers' conferences",
    ],
  },
  {
    id:       "vocational",
    title:    "ITI & Vocational Training",
    summary:  "NCVT-affiliated industrial training for tribal youth — see the dedicated ITI page.",
    highlights: [
      "Ramakrishna Mission ITI Narayanpur — Electrician, Fitter, Turner, Wireman, COPA, and more",
      "Admission priority for Abujhmarh tribal youth",
      "Details at /academics/iti and rkmitinpr.org",
    ],
  },
  {
    id:       "coaching",
    title:    "Free Coaching Center",
    summary:  "Supplementary coaching for tribal students preparing for board exams and competitive entrance tests.",
    highlights: [
      "Free coaching aligned with the Mission's ideal that education must reach those who cannot come to it",
      "Supports students from interior Abujhmarh villages and Vivekananda Vidyapeeth",
    ],
  },
  {
    id:       "ancillary",
    title:    "Ancillary Units",
    summary:  "Income-generation and self-help units supporting the Ashrama's welfare mission.",
    highlights: [
      "Vocational experience and practical skills for local community members",
      "Resources generated support broader welfare activities of the Mission",
    ],
  },
  {
    id:       "sports",
    title:    "Sports",
    summary:  "Annual sports meet and state/national-level participation in Kho-Kho, football, gymnastics, athletics and more.",
    highlights: [
      "Training in Kho-Kho, Volleyball, Gymnastics, Athletics, Football, Mallakhamb, and more",
      "5-day annual sports meet with ~2,000 tribal students from Narayanpur, Orchha, and Koileebeda blocks",
      "243 state-level and 100 national-level participants in 2019-20",
      "Rajya Khel Alankaran Puraskar (2018) for sports training in tribal areas",
    ],
  },
  {
    id:       "vishwas",
    title:    "VISHWAS",
    summary:  "Vivekananda Institute for Social Welfare and Social Action — community outreach programmes.",
    highlights: [
      "Coordinates community outreach beyond the campus to remote tribal villages",
      "Welfare, awareness, and development initiatives in Swami Vivekananda's spirit of serving the masses",
    ],
  },
];

export const ACTIVITIES_INTRO =
  "Beyond the college, Ramakrishna Mission Ashrama Narayanpur runs extensive education, healthcare, and rural development programmes serving 200+ villages in Abujhmarh — the spiritual foundation of all our work.";
