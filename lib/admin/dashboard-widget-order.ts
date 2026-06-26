import type { DashboardWidget } from "@/lib/admin/dashboard-types";

export const DEFAULT_WIDGET_GROUP_ORDER = [
  "admissions",
  "recruitment",
  "contact",
  "payments",
  "content",
  "erp",
  "examination",
  "iqac",
  "compliance",
] as const;

export type DashboardPrefs = {
  groupOrder?: string[];
  hiddenGroups?: string[];
};

export function applyDashboardPrefs(
  widgets: DashboardWidget[],
  prefs: DashboardPrefs | null | undefined,
): { group: string; widgets: DashboardWidget[] }[] {
  const hidden = new Set(prefs?.hiddenGroups ?? []);
  const byGroup = widgets.reduce<Record<string, DashboardWidget[]>>((acc, w) => {
    if (hidden.has(w.group)) return acc;
    (acc[w.group] ??= []).push(w);
    return acc;
  }, {});

  const order = prefs?.groupOrder?.length
    ? [...prefs.groupOrder, ...DEFAULT_WIDGET_GROUP_ORDER.filter((g) => !prefs.groupOrder!.includes(g))]
    : [...DEFAULT_WIDGET_GROUP_ORDER];

  const seen = new Set<string>();
  const groups: { group: string; widgets: DashboardWidget[] }[] = [];

  for (const group of order) {
    if (seen.has(group) || hidden.has(group)) continue;
    const groupWidgets = byGroup[group];
    if (!groupWidgets?.length) continue;
    seen.add(group);
    groups.push({ group, widgets: groupWidgets });
  }

  for (const [group, groupWidgets] of Object.entries(byGroup)) {
    if (!seen.has(group) && groupWidgets.length) {
      groups.push({ group, widgets: groupWidgets });
    }
  }

  return groups;
}
