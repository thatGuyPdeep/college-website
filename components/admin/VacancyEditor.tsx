"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertVacancy, setVacancyStatus } from "@/lib/actions/admin-vacancies";
import type { Vacancy } from "@/lib/supabase/types";

export function VacancyEditor({ vacancies }: { vacancies: Vacancy[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", designation: "", description: "", closes_at: "",
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await upsertVacancy({
      ...form,
      closes_at: form.closes_at || null,
      status:    "open",
    });
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Vacancy published");
    setForm({ title: "", designation: "", description: "", closes_at: "" });
    router.refresh();
  }

  async function close(id: string) {
    const result = await setVacancyStatus(id, "closed");
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Vacancy closed");
    router.refresh();
  }

  async function reopen(id: string) {
    const result = await setVacancyStatus(id, "open");
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Vacancy reopened");
    router.refresh();
  }

  return (
    <div className="space-y-6 mb-10">
      <form onSubmit={create} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#0D2660]">Post New Vacancy</h3>
        <Input placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input placeholder="Designation (e.g. Assistant Professor)" value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })} />
        <textarea className="w-full border rounded-md p-3 text-sm min-h-[80px]" placeholder="Description"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Input type="date" value={form.closes_at} onChange={(e) => setForm({ ...form, closes_at: e.target.value })} />
        <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Publish Vacancy</Button>
      </form>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Manage Vacancies ({vacancies.length})</h3>
        <ul className="space-y-2">
          {vacancies.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 bg-white border border-blue-50 rounded-lg p-4 text-sm">
              <div>
                <span className="font-medium">{v.title}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${v.status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  {v.status}
                </span>
              </div>
              <div className="flex gap-2">
                {v.status === "open" ? (
                  <Button type="button" size="sm" variant="outline" onClick={() => void close(v.id)}>Close</Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" onClick={() => void reopen(v.id)}>Reopen</Button>
                )}
              </div>
            </li>
          ))}
          {vacancies.length === 0 && <p className="text-sm text-gray-400">No vacancies in database.</p>}
        </ul>
      </div>
    </div>
  );
}
