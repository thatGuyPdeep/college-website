// ── ENUMS ──────────────────────────────────────────────────────────
export type UserRole =
  | "applicant"
  | "faculty_applicant"
  | "student"
  | "faculty"
  | "admissions_staff"
  | "hr_staff"
  | "content_editor"
  | "admin"
  | "super_admin";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "waitlisted"
  | "approved"
  | "rejected";

export type DocumentStatus  = "pending" | "submitted" | "approved" | "rejected";
export type PaymentStatus   = "created" | "paid" | "failed" | "refunded";
export type VacancyStatus   = "open" | "closed";
export type FacultyAppStatus = "submitted" | "shortlisted" | "rejected" | "interview";
export type ProgramLevel    = "ug" | "pg" | "diploma" | "phd";
export type StudyMode       = "full_time" | "part_time" | "odl";

// ── DOMAIN MODELS ────────────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  overview: string | null;
  created_at: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  department_id: string | null;
  level: ProgramLevel;
  mode: StudyMode;
  duration: string | null;
  eligibility: string | null;
  fees: number | null;
  curriculum: string | null;
  outcomes: string | null;
  intake: number | null;
  is_active: boolean;
  created_at: string;
  departments?: Department;
}

// ── STRUCTURED FORM DATA ─────────────────────────────────────────
export interface PersonalData {
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: "male" | "female" | "other";
  category: "general" | "obc" | "sc" | "st" | "ews" | "other";
  nationality?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AcademicEntry {
  board: string;
  school: string;
  year: string;
  percentage: string;
}

export interface AcademicData {
  tenth: AcademicEntry;
  twelfth: AcademicEntry;
  entrance_exam?: string;
  entrance_score?: string;
}

export interface ProgramData {
  program_id: string;
  program_name: string;
}

export interface DocsChecklist {
  [doc_type: string]: {
    status: DocumentStatus;
    file_path: string | null;
    uploaded_at: string | null;
  };
}

// ── APPLICATION ──────────────────────────────────────────────────
export interface Application {
  id: string;
  application_no: string | null;
  academic_year: string;
  applicant_id: string;
  program_id: string | null;
  status: ApplicationStatus;
  current_step: number;
  personal_data: PersonalData | null;
  academic_data: AcademicData | null;
  program_data: ProgramData | null;
  docs_checklist: DocsChecklist | null;
  submitted_at: string | null;
  decided_at: string | null;
  decision_reason: string | null;
  created_at: string;
  updated_at: string;
  programs?: Program;
}

/** Application row joined with profile + program (from v_applications view) */
export interface ApplicationView extends Application {
  applicant_name: string | null;
  applicant_email: string | null;
  applicant_phone: string | null;
  program_name: string | null;
  program_level: ProgramLevel | null;
}

// ── DOCUMENT ─────────────────────────────────────────────────────
export interface ApplicationDocument {
  id: string;
  application_id: string;
  doc_type: string;
  file_path: string | null;
  status: DocumentStatus;
  reason: string | null;
  uploaded_at: string | null;
}

// ── AUDIT LOG ────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  note: string | null;
  created_at: string;
}

// ── NOTIFICATION ─────────────────────────────────────────────────
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ── FACULTY ──────────────────────────────────────────────────────
export interface FacultyMember {
  id: string;
  full_name: string;
  designation: string | null;
  department_id: string | null;
  qualifications: string | null;
  specialization: string | null;
  experience_years: number | null;
  photo_url: string | null;
  profile: string | null;
  is_active: boolean;
  departments?: Department;
}

export interface Vacancy {
  id: string;
  title: string;
  department_id: string | null;
  designation: string | null;
  description: string | null;
  status: VacancyStatus;
  posted_at: string;
  closes_at: string | null;
  departments?: Department;
}

export interface DisclosureItem {
  id: string;
  section: string;
  label: string;
  link_url: string | null;
  file_path: string | null;
  sort_order: number;
  updated_at: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  body: string | null;
  cover_url: string | null;
  published_at: string | null;
  is_published: boolean;
}

// ── SERVER ACTION RESULT TYPES ───────────────────────────────────
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ── SUPABASE DATABASE TYPE STUB ───────────────────────────────────
export type Database = {
  public: {
    Tables: {
      profiles:              { Row: Profile;              Insert: Partial<Profile>;              Update: Partial<Profile>              };
      departments:           { Row: Department;           Insert: Partial<Department>;           Update: Partial<Department>           };
      programs:              { Row: Program;              Insert: Partial<Program>;              Update: Partial<Program>              };
      faculty:               { Row: FacultyMember;        Insert: Partial<FacultyMember>;        Update: Partial<FacultyMember>        };
      applications:          { Row: Application;          Insert: Partial<Application>;          Update: Partial<Application>          };
      application_documents: { Row: ApplicationDocument;  Insert: Partial<ApplicationDocument>;  Update: Partial<ApplicationDocument>  };
      audit_logs:            { Row: AuditLog;             Insert: Partial<AuditLog>;             Update: Partial<AuditLog>             };
      app_notifications:     { Row: Notification;         Insert: Partial<Notification>;         Update: Partial<Notification>         };
      vacancies:             { Row: Vacancy;              Insert: Partial<Vacancy>;              Update: Partial<Vacancy>              };
      news_events:           { Row: NewsEvent;            Insert: Partial<NewsEvent>;            Update: Partial<NewsEvent>            };
      disclosure_items:      { Row: DisclosureItem;       Insert: Partial<DisclosureItem>;       Update: Partial<DisclosureItem>       };
    };
    Views: {
      v_applications: { Row: ApplicationView };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
