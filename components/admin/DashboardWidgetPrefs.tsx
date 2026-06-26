"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveDashboardPrefs } from "@/lib/actions/dashboard-prefs";
import {
  DEFAULT_WIDGET_GROUP_ORDER,
  type DashboardPrefs,
} from "@/lib/admin/dashboard-widget-order";
import { Settings2 } from "lucide-react";

const GROUP_LABELS: Record<string, string> = {
  admissions: "Admissions",
  recruitment: "Recruitment",
  contact: "Contact & Grievance",
  payments: "Payments",
  content: "Content",
  erp: "Student ERP",
  examination: "Examination",
  iqac: "IQAC",
  compliance: "Executive & Compliance",
};

type Props = {
  prefs: DashboardPrefs;
  availableGroups: string[];
};

export function DashboardWidgetPrefs({ prefs, availableGroups }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [hidden, setHidden] = useState<Set<string>>(new Set(prefs.hiddenGroups ?? []));
  const [order, setOrder] = useState<string[]>(() => {
    const base = prefs.groupOrder?.length
      ? prefs.groupOrder.filter((g) => availableGroups.includes(g))
      : [];
    const rest = availableGroups.filter((g) => !base.includes(g));
    const ordered = [...base, ...rest];
    return ordered.length ? ordered : availableGroups;
  });

  function toggleGroup(group: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }

  function move(group: string, dir: -1 | 1) {
    setOrder((prev) => {
      const idx = prev.indexOf(group);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  function save() {
    startTransition(async () => {
      const result = await saveDashboardPrefs({
        groupOrder: order,
        hiddenGroups: [...hidden],
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Dashboard layout saved");
      setOpen(false);
      router.refresh();
    });
  }

  if (!availableGroups.length) return null;

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-[#0D2660] transition-colors"
      >
        <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
        {open ? "Hide widget settings" : "Customise KPI widgets"}
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-blue-100 bg-white p-4 space-y-3">
          <p className="text-xs text-gray-500">
            Show or hide widget groups and change their order on your dashboard.
          </p>
          <ul className="space-y-2">
            {order.map((group) => (
              <li key={group} className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={!hidden.has(group)}
                    onChange={() => toggleGroup(group)}
                  />
                  <span className="truncate">{GROUP_LABELS[group] ?? group}</span>
                </label>
                <div className="flex gap-1 shrink-0">
                  <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => move(group, -1)}>↑</Button>
                  <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => move(group, 1)}>↓</Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 pt-1">
            <Button type="button" size="sm" className="bg-[#0D2660] text-white" disabled={pending} onClick={save}>
              {pending ? "Saving…" : "Save layout"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setHidden(new Set());
                setOrder([...DEFAULT_WIDGET_GROUP_ORDER].filter((g) => availableGroups.includes(g)));
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
