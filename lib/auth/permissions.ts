import type { UserRole } from "@/lib/supabase/types";

export type AdminModule =
  | "dashboard"
  | "admissions"
  | "recruitment"
  | "contact"
  | "payments"
  | "content"
  | "examination"
  | "erp"
  | "iqac"
  | "audit"
  | "users"
  | "settings"
  | "ai"
  | "compliance"
  | "notifications";

export type AdminAction = "view" | "edit" | "approve" | "export" | "admin";

const ACTION_RANK: Record<AdminAction, number> = {
  view: 1,
  edit: 2,
  approve: 3,
  export: 3,
  admin: 4,
};

/** Module → action → roles allowed */
const MATRIX: Record<AdminModule, Partial<Record<AdminAction, UserRole[]>>> = {
  dashboard: {
    view: [
      "admissions_staff", "examination_staff", "hr_staff", "content_editor",
      "accounts_staff", "iqac_coordinator", "principal", "hod", "faculty",
      "admin", "super_admin",
    ],
  },
  notifications: {
    view: [
      "admissions_staff", "examination_staff", "hr_staff", "content_editor",
      "accounts_staff", "iqac_coordinator", "principal", "hod", "faculty",
      "admin", "super_admin",
    ],
    edit: [
      "admissions_staff", "examination_staff", "hr_staff", "content_editor",
      "accounts_staff", "iqac_coordinator", "principal", "hod", "faculty",
      "admin", "super_admin",
    ],
  },
  admissions: {
    view: ["admissions_staff", "hod", "principal", "admin", "super_admin"],
    edit: ["admissions_staff", "admin", "super_admin"],
    approve: ["admissions_staff", "admin", "super_admin"],
    export: ["admissions_staff", "principal", "admin", "super_admin"],
    admin: ["admin", "super_admin"],
  },
  recruitment: {
    view: ["hr_staff", "admin", "super_admin"],
    edit: ["hr_staff", "admin", "super_admin"],
    approve: ["hr_staff", "admin", "super_admin"],
    export: ["hr_staff", "admin", "super_admin"],
    admin: ["admin", "super_admin"],
  },
  contact: {
    view: ["admissions_staff", "examination_staff", "admin", "super_admin", "principal"],
    edit: ["admissions_staff", "admin", "super_admin"],
    export: ["admin", "super_admin", "principal"],
  },
  payments: {
    view: ["admissions_staff", "accounts_staff", "admin", "super_admin", "principal"],
    edit: ["accounts_staff", "admin", "super_admin"],
    export: ["accounts_staff", "admin", "super_admin", "principal"],
    admin: ["super_admin"],
  },
  content: {
    view: ["content_editor", "admin", "super_admin"],
    edit: ["content_editor", "admin", "super_admin"],
    admin: ["admin", "super_admin"],
  },
  examination: {
    view: ["examination_staff", "admin", "super_admin"],
    edit: ["examination_staff", "admin", "super_admin"],
    admin: ["admin", "super_admin"],
  },
  erp: {
    view: ["faculty", "hod", "admin", "super_admin"],
    edit: ["faculty", "hod", "admin", "super_admin"],
    admin: ["admin", "super_admin"],
  },
  iqac: {
    view: ["iqac_coordinator", "principal", "admin", "super_admin"],
    edit: ["iqac_coordinator", "admin", "super_admin"],
    admin: ["admin", "super_admin"],
  },
  audit: {
    view: ["admissions_staff", "principal", "admin", "super_admin"],
    export: ["admin", "super_admin"],
  },
  users: {
    view: ["admin", "super_admin"],
    edit: ["admin", "super_admin"],
    admin: ["super_admin"],
  },
  settings: {
    view: ["admin", "super_admin"],
    edit: ["super_admin"],
    admin: ["super_admin"],
  },
  ai: {
    view: ["admin", "super_admin", "principal"],
  },
  compliance: {
    view: ["principal", "admin", "super_admin"],
    edit: ["admin", "super_admin"],
  },
};

export const SUPER_ADMIN_ONLY_MODULES: AdminModule[] = ["settings"];

export function can(role: UserRole, module: AdminModule, action: AdminAction = "view"): boolean {
  const mod = MATRIX[module];
  if (!mod) return false;

  const requiredRank = ACTION_RANK[action];

  for (const [act, roles] of Object.entries(mod) as [AdminAction, UserRole[]][]) {
    if (!roles.includes(role)) continue;
    if (ACTION_RANK[act] >= requiredRank) return true;
  }
  return false;
}

export function modulesForRole(role: UserRole): AdminModule[] {
  return (Object.keys(MATRIX) as AdminModule[]).filter((m) => can(role, m, "view"));
}

/** Roles that a given assigner may grant */
export function assignableRoles(assignerRole: UserRole): UserRole[] {
  const staffRoles: UserRole[] = [
    "admissions_staff", "examination_staff", "hr_staff", "content_editor",
    "accounts_staff", "iqac_coordinator", "principal", "hod", "faculty",
    "admin",
  ];

  if (assignerRole === "super_admin") {
    return [...staffRoles, "super_admin", "student", "applicant"];
  }
  if (assignerRole === "admin") {
    return staffRoles;
  }
  return [];
}

export function canAssignRole(assignerRole: UserRole, targetRole: UserRole): boolean {
  return assignableRoles(assignerRole).includes(targetRole);
}

export function canDeactivateUsers(role: UserRole): boolean {
  return role === "super_admin";
}

export function canInviteStaff(role: UserRole): boolean {
  return role === "super_admin";
}

export function canEditSettings(role: UserRole): boolean {
  return role === "super_admin";
}

export function isDashboardStaff(role: UserRole): boolean {
  return can(role, "dashboard", "view");
}
