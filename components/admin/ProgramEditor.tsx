"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertProgramAdmin } from "@/lib/actions/admin-content";
import { ContentPreviewLink } from "@/components/admin/ContentPreviewLink";
import type { Department, Program, ProgramLevel, StudyMode } from "@/lib/supabase/types";

type DeptOption = Pick<Department, "id" | "name">;

const LEVELS: ProgramLevel[] = ["ug", "pg", "diploma", "phd"];
const MODES: StudyMode[] = ["full_time", "part_time", "odl"];

const empty = {
  id: "",
  name: "",
  slug: "",
  department_id: "",
  level: "ug" as ProgramLevel,
  mode: "full_time" as StudyMode,
  duration: "",
  eligibility: "",
  fees: "",
  intake: "",
  is_active: true,
};

export function ProgramEditor({
  items,
  departments,
}: {
  items: Program[];
  departments: DeptOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(empty);

  function loadItem(p: Program) {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      department_id: p.department_id ?? "",
      level: p.level,
      mode: p.mode,
      duration: p.duration ?? "",
      eligibility: p.eligibility ?? "",
      fees: p.fees != null ? String(p.fees) : "",
      intake: p.intake != null ? String(p.intake) : "",
      is_active: p.is_active,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").slice(0, 60);
    const result = await upsertProgramAdmin({
      ...(form.id ? { id: form.id } : {}),
      name: form.name,
      slug,
      department_id: form.department_id || null,
      level: form.level,
      mode: form.mode,
      duration: form.duration || null,
      eligibility: form.eligibility || null,
      fees: form.fees ? Number(form.fees) : null,
      intake: form.intake ? Number(form.intake) : null,
      is_active: form.is_active,
    });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(form.id ? "Program updated" : "Program added");
    setForm(empty);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#0D2660]">{form.id ? "Edit Programme" : "Add Programme"}</h3>
        <Input placeholder="Programme name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <select
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}
        >
          <option value="">No department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <div className="grid sm:grid-cols-2 gap-3">
          <select className="border rounded-md px-3 py-2 text-sm" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as ProgramLevel })}>
            {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
          <select className="border rounded-md px-3 py-2 text-sm" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as StudyMode })}>
            {MODES.map((m) => <option key={m} value={m}>{m.replace("_", " ")}</option>)}
          </select>
        </div>
        <Input placeholder="Duration (e.g. 3 years)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        <textarea className="w-full border rounded-md p-3 text-sm min-h-[60px]" placeholder="Eligibility"
          value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input type="number" placeholder="Fees (INR)" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} />
          <Input type="number" placeholder="Intake" value={form.intake} onChange={(e) => setForm({ ...form, intake: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active (visible on site)
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">
            {loading ? "Saving…" : "Save"}
          </Button>
          {form.id && (
            <Button type="button" variant="outline" onClick={() => setForm(empty)}>Clear</Button>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p.id} className="bg-white border border-blue-50 rounded-lg p-4 flex justify-between gap-4 items-start">
            <div>
              <div className="font-medium text-sm">{p.name}</div>
              <div className="text-xs text-gray-400">
                {p.level.toUpperCase()} · {p.mode.replace("_", " ")} · {p.is_active ? "Active" : "Hidden"}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {p.is_active && p.slug && <ContentPreviewLink href={`/academics/courses/${p.slug}`} />}
              <Button type="button" size="sm" variant="outline" onClick={() => loadItem(p)}>Edit</Button>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400">No programmes in database — static list shown on /academics</p>}
      </ul>
    </div>
  );
}
