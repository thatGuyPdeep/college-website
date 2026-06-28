/** Education content from Obsidian activities-education.md */

export const VIDYAPEETH = {
  name: "Ramakrishna Mission Vivekananda Vidyapeeth",
  strength: { total: 2498, boys: 1529, girls: 969 },
  pvtgNote:
    "More than 75% of students are from the Maria community, a Particularly Vulnerable Tribal Group (PVTG). All tribal students receive free accommodation, food, stationery, uniforms, and medical facilities.",
  streams: ["Science", "Commerce", "Art", "Agriculture", "Home-Science"],
  facilities: [
    "Four modern laboratories for practical learning",
    "Separate primary section for Classes 1–5",
    "Science playground for elementary students",
    "Play School for early education",
    "Vivekananda Computer Training Center (since 29 April 2008) for Class 6 onwards",
  ],
  hostel: {
    boys: 668,
    girls: 400,
    note: "Hostel is for Abujhmarh students only — three separate hostel buildings for boys; girls' hostel in another section of campus. Students are groomed in a spiritual way of life.",
  },
} as const;

export const INTERIOR_CENTERS = {
  intro:
    "In the most interior of Abujhmarh, the Mission runs 6 free residential schools — Vivekananda Vidyamandirs (3 High & 3 Middle Schools) at Akabeda, Kutul, Kachchapal, Irakbhatti, Kundla and Orchha villages. All interior school students get admitted to Ramakrishna Mission Vivekananda Vidyapeeth at Narainpur after completing studies in their respective schools.",
  totalStrength: { total: 1351, boys: 801, girls: 550 },
  centers: [
    { name: "Vivekananda Vidya Mandir, Akabeda", boys: 195, girls: 49, total: 244 },
    { name: "Vivekananda Vidya Mandir, Kundla", boys: 207, girls: 56, total: 263 },
    { name: "Vivekananda Vidya Mandir, Kutul", boys: 124, girls: 40, total: 164 },
    { name: "Vivekananda Vidya Mandir, Kachchapal", boys: 139, girls: 33, total: 172 },
    { name: "Vivekananda Vidya Mandir, Irrakbhatti", boys: 136, girls: 44, total: 180 },
    { name: "Vivekananda Vidya Mandir, Orchha", boys: 0, girls: 328, total: 328 },
  ],
} as const;

export const SPORTS = {
  intro:
    "In addition to educational activities, students receive special training in Kho-Kho, Volleyball, Gymnastics, Athletics, Football, Mallakhamb, and more. Every October, a 5-day sports meet is held with about 2,000 tribal students from Narayanpur, Orchha, and Koileebeda blocks — all provided free boarding and lodging.",
  nationalNote:
    "In 2019-20, 243 students participated in state-level competitions and 100 students in national-level competitions.",
  participation: [
    {
      year: "2016-17",
      state: { football: 44, khoKho: 3, gymnastics: 21, total: 68 },
      national: { football: 5, khoKho: 1, gymnastics: 6, total: 12 },
    },
    {
      year: "2017-18",
      state: { football: 86, khoKho: 24, gymnastics: 19, badminton: 8, athletics: 1, volleyball: 6, basketball: 12, total: 156 },
      national: { football: 27, khoKho: 6, gymnastics: 4, total: 36 },
    },
    {
      year: "2018-19",
      state: { football: 84, khoKho: 41, gymnastics: 21, badminton: 5, athletics: 15, volleyball: 11, basketball: 42, mallakhamb: 8, total: 227 },
      national: { football: 56, khoKho: 9, gymnastics: 2, mallakhamb: 8, total: 75 },
    },
    {
      year: "2019-20",
      state: { football: 89, khoKho: 32, gymnastics: 18, badminton: 16, athletics: 14, volleyball: 14, basketball: 29, mallakhamb: 9, tableTennis: 7, yoga: 15, total: 243 },
      national: { football: 71, khoKho: 12, gymnastics: 3, badminton: 1, athletics: 1, volleyball: 4, mallakhamb: 8, total: 100 },
    },
  ],
} as const;
