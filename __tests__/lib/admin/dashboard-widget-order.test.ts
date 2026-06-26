import { describe, it, expect } from "vitest";
import { applyDashboardPrefs } from "@/lib/admin/dashboard-widget-order";
import type { DashboardWidget } from "@/lib/admin/dashboard-types";

const widget = (
  group: DashboardWidget["group"],
  label: string,
): DashboardWidget => ({
  group,
  label,
  value: "1",
  href: "/admin",
  color: "text-blue-700 bg-blue-100",
});

describe("applyDashboardPrefs", () => {
  it("DASH-01: default order places admissions before payments", () => {
    const widgets = [widget("payments", "Paid"), widget("admissions", "Apps")];
    const result = applyDashboardPrefs(widgets, {});
    expect(result.map((g) => g.group)).toEqual(["admissions", "payments"]);
  });

  it("DASH-02: hiddenGroups omits group", () => {
    const widgets = [widget("admissions", "Apps"), widget("payments", "Paid")];
    const result = applyDashboardPrefs(widgets, { hiddenGroups: ["payments"] });
    expect(result.map((g) => g.group)).toEqual(["admissions"]);
  });

  it("DASH-03: custom groupOrder reorders groups", () => {
    const widgets = [widget("admissions", "Apps"), widget("payments", "Paid")];
    const result = applyDashboardPrefs(widgets, { groupOrder: ["payments", "admissions"] });
    expect(result.map((g) => g.group)).toEqual(["payments", "admissions"]);
  });

  it("DASH-04: empty widgets returns empty", () => {
    expect(applyDashboardPrefs([], { groupOrder: ["admissions"] })).toEqual([]);
  });

  it("preserves widgets within a group", () => {
    const widgets = [
      widget("admissions", "Total"),
      widget("admissions", "Pending"),
    ];
    const result = applyDashboardPrefs(widgets, {});
    expect(result).toHaveLength(1);
    expect(result[0].widgets).toHaveLength(2);
  });
});
