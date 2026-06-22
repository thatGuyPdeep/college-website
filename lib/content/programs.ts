import { PROGRAMS, PROGRAM_LEVELS, STUDY_MODES } from "@/lib/utils/constants";
import { getPublicPrograms } from "@/lib/content/public-data";
import type { Program } from "@/lib/supabase/types";

export type ExplorerProgram = {
  id: string;
  slug: string;
  name: string;
  level: string;
  levelLabel: string;
  mode: string;
  modeLabel: string;
  duration: string | null;
  department: string | null;
  short: string | null;
  eligibility: string | null;
  fees: number | null;
  curriculum: string | null;
  outcomes: string | null;
  highlights: string[];
  fromDb: boolean;
};

function fromConstants(): ExplorerProgram[] {
  return PROGRAMS.map((p) => ({
    id:          `const-${p.slug}`,
    slug:        p.slug,
    name:        p.name,
    level:       p.level,
    levelLabel:  PROGRAM_LEVELS[p.level] ?? p.level,
    mode:        p.mode,
    modeLabel:   STUDY_MODES[p.mode] ?? p.mode,
    duration:    p.duration,
    department:  p.dept,
    short:       p.short,
    eligibility: "10+2 pass from a recognized board (programme-specific requirements apply).",
    fees:        null,
    curriculum:  null,
    outcomes:    null,
    highlights:  [...p.highlights],
    fromDb:      false,
  }));
}

function fromDb(p: Program & { departments?: { name: string } | null }): ExplorerProgram {
  return {
    id:          p.id,
    slug:        p.slug,
    name:        p.name,
    level:       p.level,
    levelLabel:  PROGRAM_LEVELS[p.level] ?? p.level,
    mode:        p.mode,
    modeLabel:   STUDY_MODES[p.mode] ?? p.mode,
    duration:    p.duration,
    department:  p.departments?.name ?? null,
    short:       p.eligibility?.slice(0, 120) ?? null,
    eligibility: p.eligibility,
    fees:        p.fees,
    curriculum:  p.curriculum,
    outcomes:    p.outcomes,
    highlights:  [],
    fromDb:      true,
  };
}

export async function getExplorerPrograms(): Promise<ExplorerProgram[]> {
  const dbPrograms = await getPublicPrograms();
  const dbSlugs = new Set(dbPrograms.map((p) => p.slug));
  const merged = [
    ...dbPrograms.map((p) => fromDb(p as Program & { departments?: { name: string } })),
    ...fromConstants().filter((p) => !dbSlugs.has(p.slug)),
  ];
  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProgramBySlug(slug: string): Promise<ExplorerProgram | null> {
  const all = await getExplorerPrograms();
  return all.find((p) => p.slug === slug) ?? null;
}
