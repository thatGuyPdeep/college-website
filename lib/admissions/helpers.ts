import type { AcademicData, PersonalData, ProgramData } from "@/lib/supabase/types";
import { REQUIRED_DOCUMENTS } from "@/lib/utils/constants";

export const EMPTY_ACADEMIC: AcademicData = {
  tenth:   { board: "", school: "", year: "", percentage: "" },
  twelfth: { board: "", school: "", year: "", percentage: "" },
  entrance_exam:  "",
  entrance_score: "",
};

export function hasPersonalData(data: unknown): data is PersonalData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return Boolean(
    d.full_name && d.email && d.phone && d.dob && d.gender && d.category && d.address && d.pincode
  );
}

export function hasAcademicData(data: unknown): data is AcademicData {
  if (!data || typeof data !== "object") return false;
  const d = data as AcademicData;
  return Boolean(d.tenth?.board?.trim() && d.tenth?.year?.trim());
}

export function hasProgramChoice(app: {
  program_id?: string | null;
  program_data?: unknown;
}): boolean {
  const pd = app.program_data as ProgramData | null;
  return Boolean(app.program_id || pd?.program_id);
}

export function missingDocuments(checklist: Record<string, { status?: string }> | null | undefined): string[] {
  if (!checklist) return REQUIRED_DOCUMENTS.map((d) => d.label);
  return REQUIRED_DOCUMENTS.filter((doc) => {
    const entry = checklist[doc.type];
    return entry?.status !== "submitted" && entry?.status !== "approved";
  }).map((d) => d.label);
}

export function academicFromUnknown(data: unknown): AcademicData {
  if (!data || typeof data !== "object") return { ...EMPTY_ACADEMIC };
  const d = data as AcademicData;
  return {
    tenth: {
      board:      d.tenth?.board      ?? "",
      school:     d.tenth?.school     ?? "",
      year:       d.tenth?.year       ?? "",
      percentage: d.tenth?.percentage ?? "",
    },
    twelfth: {
      board:      d.twelfth?.board      ?? "",
      school:     d.twelfth?.school     ?? "",
      year:       d.twelfth?.year       ?? "",
      percentage: d.twelfth?.percentage ?? "",
    },
    entrance_exam:  d.entrance_exam  ?? "",
    entrance_score: d.entrance_score ?? "",
  };
}
