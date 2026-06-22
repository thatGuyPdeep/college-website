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
    programSlugs: ["bsc-cs", "btech-cse"],
  },
  {
    slug: "physics",
    name: "Physics",
    overview: "B.Sc Physics — classical & modern physics, electronics, and renewable energy.",
    programs: ["B.Sc — Physics"],
    programSlugs: ["bsc-physics"],
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    overview: "Supporting department for science and commerce programmes.",
    programs: [],
    programSlugs: [],
  },
  {
    slug: "management",
    name: "Management",
    overview: "Management studies and MBA-related academic support.",
    programs: [],
    programSlugs: [],
  },
];

export function getDepartmentBySlug(slug: string): DepartmentInfo | null {
  return DEPARTMENTS.find((d) => d.slug === slug) ?? null;
}
