"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSeatMatrixOverrides } from "@/lib/actions/site-settings";
import type { SeatMatrixOverrides } from "@/lib/actions/site-settings";
import { PROGRAMS } from "@/lib/utils/constants";

export function SeatMatrixEditor({ initial }: { initial: SeatMatrixOverrides }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [session, setSession] = useState(initial.session ?? "2026–27");
  const [notes, setNotes] = useState(initial.notes ?? "");
  const [overrides, setOverrides] = useState<Record<string, { sanctioned?: string; applicationsReceived?: string }>>(
    () => {
      const ug = initial.ug ?? {};
      return Object.fromEntries(
        Object.entries(ug).map(([k, v]) => [
          k,
          {
            sanctioned: v.sanctioned != null ? String(v.sanctioned) : undefined,
            applicationsReceived: v.applicationsReceived != null ? String(v.applicationsReceived) : undefined,
          },
        ]),
      );
    },
  );

  function setOverride(slug: string, field: "sanctioned" | "applicationsReceived", value: string) {
    setOverrides((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], [field]: value },
    }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveSeatMatrixOverrides({ session, notes, ug: overrides });
      if (!res.ok) { toast.error(res.error); return; }
      toast.success("Seat matrix saved");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="session">Academic session</Label>
          <Input id="session" value={session} onChange={(e) => setSession(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="notes">Public notes (optional)</Label>
          <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-blue-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0D2660] text-white text-left">
              <th className="px-4 py-2">Programme</th>
              <th className="px-4 py-2">Sanctioned intake</th>
              <th className="px-4 py-2">Applications received</th>
            </tr>
          </thead>
          <tbody>
            {PROGRAMS.map((p) => (
              <tr key={p.slug} className="border-t border-blue-50">
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2">
                  <Input
                    value={overrides[p.slug]?.sanctioned ?? ""}
                    placeholder="As notified"
                    onChange={(e) => setOverride(p.slug, "sanctioned", e.target.value)}
                    className="h-8"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    value={overrides[p.slug]?.applicationsReceived ?? ""}
                    placeholder="Auto from stats"
                    onChange={(e) => setOverride(p.slug, "applicationsReceived", e.target.value)}
                    className="h-8"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button type="submit" disabled={pending} className="bg-[#C8201A] text-white">
        {pending ? "Saving…" : "Save seat matrix"}
      </Button>
    </form>
  );
}
