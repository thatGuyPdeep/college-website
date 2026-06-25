import { describe, it, expect } from "vitest";
import { can, canAssignRole, assignableRoles } from "@/lib/auth/permissions";

describe("permissions", () => {
  it("admin cannot assign super_admin", () => {
    expect(canAssignRole("admin", "super_admin")).toBe(false);
    expect(assignableRoles("admin")).not.toContain("super_admin");
  });

  it("super_admin can assign super_admin", () => {
    expect(canAssignRole("super_admin", "super_admin")).toBe(true);
  });

  it("faculty can view dashboard and erp but not admissions", () => {
    expect(can("faculty", "dashboard", "view")).toBe(true);
    expect(can("faculty", "erp", "view")).toBe(true);
    expect(can("faculty", "admissions", "view")).toBe(false);
  });

  it("examination_staff can view examination module", () => {
    expect(can("examination_staff", "examination", "view")).toBe(true);
    expect(can("examination_staff", "admissions", "approve")).toBe(false);
  });

  it("accounts_staff can view payments", () => {
    expect(can("accounts_staff", "payments", "view")).toBe(true);
    expect(can("accounts_staff", "payments", "admin")).toBe(false);
  });
});
