/** School / faculty groupings (Science, Social Science, Sports) — IIT-style academic units */

export type AcademicFacultySlug = "science" | "social-science" | "sports";

export type AcademicFaculty = {
  slug: AcademicFacultySlug;
  name: string;
  hindiName: string;
  overview: string;
  departmentSlugs: string[];
  programSlugs: string[];
};

export const ACADEMIC_FACULTIES: AcademicFaculty[] = [
  {
    slug: "science",
    name: "Faculty of Science",
    hindiName: "विज्ञान संकाय",
    overview:
      "Computer Science and allied science programmes under NEP 2020 FYUGP, with laboratories, ICT facilities, and research-oriented project work.",
    departmentSlugs: ["computer-science"],
    programSlugs: ["bsc-cs"],
  },
  {
    slug: "social-science",
    name: "Faculty of Social Sciences",
    hindiName: "सामाजिक विज्ञान संकाय",
    overview:
      "Commerce and Economics programmes preparing students for business, public policy, banking, and higher studies in social sciences.",
    departmentSlugs: ["commerce", "economics"],
    programSlugs: ["bcom", "ba-economics"],
  },
  {
    slug: "sports",
    name: "Faculty of Sports & Physical Education",
    hindiName: "क्रीड़ा एवं शारीरिक शिक्षा संकाय",
    overview:
      "B.P.Ed. and sports training aligned with the Mission's award-winning tribal sports programme and campus indoor stadium.",
    departmentSlugs: ["physical-education"],
    programSlugs: ["bped"],
  },
];

export function getAcademicFaculty(slug: string): AcademicFaculty | null {
  return ACADEMIC_FACULTIES.find((f) => f.slug === slug) ?? null;
}

export function facultyForDepartment(deptSlug: string): AcademicFaculty | null {
  return ACADEMIC_FACULTIES.find((f) => f.departmentSlugs.includes(deptSlug)) ?? null;
}
