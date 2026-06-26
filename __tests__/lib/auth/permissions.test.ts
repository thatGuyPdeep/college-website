import { describe, it, expect } from "vitest";
import {
  can,
  canAssignRole,
  assignableRoles,
  canEditSettings,
  canInviteStaff,
  modulesForRole,
} from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";

describe("permissions — role assignment", () => {
  it("RBAC-01: admin cannot assign super_admin", () => {
    expect(canAssignRole("admin", "super_admin")).toBe(false);
    expect(assignableRoles("admin")).not.toContain("super_admin");
  });

  it("RBAC-02: super_admin can assign super_admin", () => {
    expect(canAssignRole("super_admin", "super_admin")).toBe(true);
    expect(assignableRoles("super_admin")).toContain("super_admin");
  });

  it("admin can assign admissions_staff but not super_admin", () => {
    expect(canAssignRole("admin", "admissions_staff")).toBe(true);
    expect(canAssignRole("admin", "faculty")).toBe(true);
  });
});

describe("permissions — faculty (T4)", () => {
  it("RBAC-03/04/05: faculty dashboard + ERP, not admissions or users", () => {
    expect(can("faculty", "dashboard", "view")).toBe(true);
    expect(can("faculty", "erp", "view")).toBe(true);
    expect(can("faculty", "admissions", "view")).toBe(false);
    expect(can("faculty", "users", "view")).toBe(false);
  });
});

describe("permissions — examination_staff", () => {
  it("RBAC-06/07: examination module yes, admissions approve no", () => {
    expect(can("examination_staff", "examination", "view")).toBe(true);
    expect(can("examination_staff", "examination", "edit")).toBe(true);
    expect(can("examination_staff", "admissions", "approve")).toBe(false);
    expect(can("examination_staff", "recruitment", "view")).toBe(false);
  });
});

describe("permissions — accounts_staff", () => {
  it("RBAC-08/09: payments view yes, payments admin no", () => {
    expect(can("accounts_staff", "payments", "view")).toBe(true);
    expect(can("accounts_staff", "payments", "export")).toBe(true);
    expect(can("accounts_staff", "payments", "admin")).toBe(false);
  });
});

describe("permissions — admissions_staff (T1)", () => {
  it("RBAC-10/11/12: admissions yes, users and ai no", () => {
    expect(can("admissions_staff", "dashboard", "view")).toBe(true);
    expect(can("admissions_staff", "admissions", "view")).toBe(true);
    expect(can("admissions_staff", "admissions", "edit")).toBe(true);
    expect(can("admissions_staff", "users", "view")).toBe(false);
    expect(can("admissions_staff", "ai", "view")).toBe(false);
    expect(can("admissions_staff", "tasks", "view")).toBe(true);
    expect(can("admissions_staff", "notifications", "view")).toBe(true);
  });
});

describe("permissions — hr_staff (T2)", () => {
  it("RBAC-13/14: recruitment yes, admissions no", () => {
    expect(can("hr_staff", "recruitment", "view")).toBe(true);
    expect(can("hr_staff", "recruitment", "edit")).toBe(true);
    expect(can("hr_staff", "admissions", "view")).toBe(false);
  });
});

describe("permissions — content_editor (T3)", () => {
  it("RBAC-15/16: content edit yes, admissions no", () => {
    expect(can("content_editor", "content", "view")).toBe(true);
    expect(can("content_editor", "content", "edit")).toBe(true);
    expect(can("content_editor", "admissions", "view")).toBe(false);
    expect(can("content_editor", "recruitment", "view")).toBe(false);
  });
});

describe("permissions — applicant & student (T7)", () => {
  it("RBAC-17: applicant has no admin dashboard", () => {
    expect(can("applicant", "dashboard", "view")).toBe(false);
    expect(can("applicant", "admissions", "view")).toBe(false);
  });

  it("RBAC-18: student cannot access admin modules", () => {
    expect(can("student", "dashboard", "view")).toBe(false);
    expect(can("student", "erp", "view")).toBe(false);
  });
});

describe("permissions — principal & HOD", () => {
  it("RBAC-19: principal compliance and payments view", () => {
    expect(can("principal", "compliance", "view")).toBe(true);
    expect(can("principal", "payments", "view")).toBe(true);
    expect(can("principal", "admissions", "export")).toBe(true);
  });

  it("RBAC-20: hod admissions view (department scoped in actions)", () => {
    expect(can("hod", "admissions", "view")).toBe(true);
    expect(can("hod", "erp", "view")).toBe(true);
    expect(can("hod", "users", "view")).toBe(false);
  });
});

describe("permissions — settings (T5/T6)", () => {
  it("RBAC-21/22: only super_admin edits settings", () => {
    expect(canEditSettings("super_admin")).toBe(true);
    expect(canEditSettings("admin")).toBe(false);
    expect(can("admin", "settings", "view")).toBe(true);
    expect(can("admin", "settings", "edit")).toBe(false);
    expect(can("super_admin", "settings", "edit")).toBe(true);
  });

  it("only super_admin can invite staff", () => {
    expect(canInviteStaff("super_admin")).toBe(true);
    expect(canInviteStaff("admin")).toBe(false);
  });
});

describe("permissions — admin ops (T5)", () => {
  const opsModules = [
    "admissions",
    "recruitment",
    "contact",
    "content",
    "examination",
    "payments",
    "erp",
    "audit",
    "compliance",
    "tasks",
  ] as const;

  for (const mod of opsModules) {
    it(`admin can view ${mod}`, () => {
      expect(can("admin", mod, "view")).toBe(true);
    });
  }
});

describe("permissions — modulesForRole", () => {
  it("faculty modules are dashboard, erp, notifications, tasks", () => {
    const mods = modulesForRole("faculty");
    expect(mods).toContain("dashboard");
    expect(mods).toContain("erp");
    expect(mods).not.toContain("admissions");
    expect(mods).not.toContain("users");
  });

  it("applicant has no admin modules", () => {
    expect(modulesForRole("applicant")).toHaveLength(0);
  });

  it("super_admin has users and settings", () => {
    const mods = modulesForRole("super_admin");
    expect(mods).toContain("users");
    expect(mods).toContain("settings");
    expect(mods).toContain("ai");
  });
});

describe("permissions — iqac_coordinator", () => {
  it("iqac view and edit, not recruitment", () => {
    expect(can("iqac_coordinator", "iqac", "view")).toBe(true);
    expect(can("iqac_coordinator", "iqac", "edit")).toBe(true);
    expect(can("iqac_coordinator", "recruitment", "view")).toBe(false);
  });
});
