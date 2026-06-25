import type { UserRole } from "@/lib/supabase/types";

export const STAFF_ROLE_LABELS: Record<UserRole, { en: string; hi: string }> = {
  applicant:         { en: "Applicant",              hi: "आवेदक" },
  faculty_applicant: { en: "Faculty Applicant",      hi: "संकाय आवेदक" },
  student:           { en: "Student",                hi: "छात्र" },
  faculty:           { en: "Faculty",                hi: "अध्यापक" },
  admissions_staff:  { en: "Admissions Staff",       hi: "प्रवेश कर्मी" },
  examination_staff: { en: "Examination Staff",      hi: "परीक्षा कर्मी" },
  hr_staff:          { en: "HR Staff",               hi: "कार्मिक कर्मी" },
  content_editor:    { en: "Content Editor",         hi: "सामग्री संपादक" },
  accounts_staff:    { en: "Accounts Staff",         hi: "लेखा कर्मी" },
  iqac_coordinator:  { en: "IQAC Coordinator",       hi: "आईक्यूएसी समन्वयक" },
  principal:         { en: "Principal",              hi: "प्राचार्य" },
  hod:               { en: "Head of Department",     hi: "विभागाध्यक्ष" },
  admin:             { en: "College Administrator",  hi: "महाविद्यालय प्रशासक" },
  super_admin:       { en: "System Administrator",   hi: "प्रणाली प्रशासक" },
};

export function roleLabel(role: UserRole, lang: "en" | "hi" = "en"): string {
  return STAFF_ROLE_LABELS[role]?.[lang] ?? role;
}
