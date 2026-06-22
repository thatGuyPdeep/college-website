/** ITI programme content — sourced from Obsidian external/iti-rkmitinpr.md */

export const ITI_TRADES_ENGINEERING = [
  { trade: "Electrician", duration: "Two Year", seats: 40, eligibility: "10th pass with Maths & Science" },
  { trade: "Draughtsman Civil", duration: "Two Year", seats: 48, eligibility: "10th pass with Maths & Science" },
  { trade: "Fitter", duration: "Two Year", seats: 40, eligibility: "10th pass with Maths & Science" },
  { trade: "Turner", duration: "Two Year", seats: 40, eligibility: "10th pass with Maths & Science" },
  { trade: "Wireman", duration: "Two Year", seats: 40, eligibility: "10th pass" },
  { trade: "Mason", duration: "One Year", seats: 48, eligibility: "10th pass" },
  { trade: "Welder", duration: "One Year", seats: 40, eligibility: "10th pass" },
  { trade: "Mechanic Diesel", duration: "One Year", seats: 48, eligibility: "10th pass with Maths & Science" },
  { trade: "Mechanic Tractor", duration: "One Year", seats: 40, eligibility: "10th pass" },
];

export const ITI_TRADES_NON_ENGINEERING = [
  { trade: "Computer Operator and Programming Assistant (COPA)", duration: "One Year", seats: 48, eligibility: "10th pass" },
];

export const ITI_CONTACT = {
  address: "Ramakrishna Mission Industrial Training Institute, Narayanpur, P.O. Narayanpur, Dist. Narayanpur, Pin – 494661",
  phone: "07781-252360",
  email: "info@rkmitinpr.org",
  altEmail: "rkmiti.narainpur@gmail.com",
  vacancyEmail: "rkmitivacancy@gmail.com",
  hours: "Monday – Saturday, 08:00 AM – 05:30 PM",
  website: "https://rkmitinpr.org/",
  facebook: "https://www.facebook.com/profile.php?id=100071799710721",
  youtube: "https://www.youtube.com/channel/UCUIexcwEiDa1paNTYsCBxcg",
};

export const ITI_ABOUT_EN =
  "Run by Ramakrishna Mission Ashrama, Narayanpur, the ITI was established on 01 October 2012 to train unemployed Scheduled Tribe youth of Abujhmarh and nearby tribal areas. It now runs 10 NCVT-affiliated trades with about 350 ST trainees across 20 units, using modern equipment and experienced instructors to enable employment and self-employment.";

export const ITI_ADMISSION_PRIORITY = [
  "Tribal youth of Abujhmarh (merit basis)",
  "Local residents of Narayanpur district",
  "Youth of Bastar division (Kanker, Kondagaon, Bastar)",
  "ST youth from other districts of Chhattisgarh",
];

export const ITI_FACILITIES = [
  { label: "Total campus area", value: "40,468.73 sq. m." },
  { label: "Covered area", value: "9,408.775 sq. m." },
  { label: "Workshop area", value: "1,509.839 sq. m." },
  { label: "Computer lab", value: "82.579 sq. m." },
  { label: "Library", value: "43.64 sq. m." },
  { label: "Play area", value: "9,600 sq. m." },
];

/** Plain text for RAG indexing */
export const ITI_RAG_TEXT = [
  ITI_ABOUT_EN,
  ITI_CONTACT.address,
  ITI_TRADES_ENGINEERING.map((t) => `${t.trade} ${t.duration} ${t.eligibility}`).join(". "),
  ITI_TRADES_NON_ENGINEERING.map((t) => `${t.trade} ${t.duration}`).join(". "),
  "Admission priority Abujhmarh tribal youth NCVT ITI Narayanpur",
].join(". ");
