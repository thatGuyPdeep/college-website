export type DepartmentInfo = {
  slug: string;
  name: string;
  overview: string;
  programs: string[];
  programSlugs: string[];
};

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    slug: "commerce",
    name: "Commerce",
    overview: "B.Com under NEP 2020 FYUGP — accounting, business law, economics, taxation and management electives.",
    programs: ["B.Com — Commerce"],
    programSlugs: ["bcom"],
  },
  {
    slug: "computer-science",
    name: "Computer Science",
    overview: "B.Sc Computer Science — programming, DBMS, AI/ML, web technologies and major project.",
    programs: ["B.Sc — Computer Science"],
    programSlugs: ["bsc-cs"],
  },
  {
    slug: "economics",
    name: "Economics",
    overview: "B.A. Economics under NEP 2020 FYUGP — micro & macroeconomics, Indian economy, econometrics, and development studies.",
    programs: ["B.A. — Economics"],
    programSlugs: ["ba-economics"],
  },
  {
    slug: "physical-education",
    name: "Physical Education",
    overview: "B.P.Ed. Sports Education — coaching, sports science, fitness training, and practical field work.",
    programs: ["B.P.Ed. — Sports Education"],
    programSlugs: ["bped"],
  },
];

export function getDepartmentBySlug(slug: string): DepartmentInfo | null {
  return DEPARTMENTS.find((d) => d.slug === slug) ?? null;
}
