"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertFacultyMember } from "@/lib/actions/admin-content";
import { ContentPreviewLink } from "@/components/admin/ContentPreviewLink";
import type { Department, FacultyMember } from "@/lib/supabase/types";

type DeptOption = Pick<Department, "id" | "name">;

const empty = {
  id: "",
  full_name: "",
  designation: "",
  department_id: "",
  qualifications: "",
  specialization: "",
  experience_years: "",
  profile: "",
  is_active: true,
};

export function FacultyEditor({
  items,
  departments,
}: {
  items: FacultyMember[];
  departments: DeptOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(empty);

  function loadItem(f: FacultyMember) {
    setForm({
      id: f.id,
      full_name: f.full_name,
      designation: f.designation ?? "",
      department_id: f.department_id ?? "",
      qualifications: f.qualifications ?? "",
      specialization: f.specialization ?? "",
      experience_years: f.experience_years != null ? String(f.experience_years) : "",
      profile: f.profile ?? "",
      is_active: f.is_active,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await upsertFacultyMember({
      ...(form.id ? { id: form.id } : {}),
      full_name: form.full_name,
      designation: form.designation || null,
      department_id: form.department_id || null,
      qualifications: form.qualifications || null,
      specialization: form.specialization || null,
      experience_years: form.experience_years ? Number(form.experience_years) : null,
      profile: form.profile || null,
      is_active: form.is_active,
    });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(form.id ? "Faculty updated" : "Faculty added");
    setForm(empty);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#0D2660]">{form.id ? "Edit Faculty" : "Add Faculty"}</h3>
        <Input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <Input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
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
        <Input placeholder="Qualifications" value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
        <Input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
        <Input type="number" placeholder="Experience (years)" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
        <textarea
          className="w-full border rounded-md p-3 text-sm min-h-[80px]"
          placeholder="Profile / bio"
          value={form.profile}
          onChange={(e) => setForm({ ...form, profile: e.target.value })}
        />
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
        {items.map((f) => (
          <li key={f.id} className="bg-white border border-blue-50 rounded-lg p-4 flex justify-between gap-4 items-start">
            <div>
              <div className="font-medium text-sm">{f.full_name}</div>
              <div className="text-xs text-gray-400">
                {f.designation ?? "—"} · {f.is_active ? "Active" : "Hidden"}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {f.is_active && <ContentPreviewLink href={`/faculty/${f.id}`} />}
              <Button type="button" size="sm" variant="outline" onClick={() => loadItem(f)}>Edit</Button>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400">No faculty in database — static roster shown on /faculty</p>}
      </ul>
    </div>
  );
}
