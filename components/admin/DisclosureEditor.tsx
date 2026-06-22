"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertDisclosureItem } from "@/lib/actions/admin-content";
import type { DisclosureItem } from "@/lib/supabase/types";

export function DisclosureEditor({ items }: { items: DisclosureItem[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    section: "admissions_fee",
    label: "",
    link_url: "",
    sort_order: 0,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await upsertDisclosureItem({
      ...form,
      link_url: form.link_url || null,
    });
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Disclosure item saved");
    setForm({ section: form.section, label: "", link_url: "", sort_order: form.sort_order + 1 });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#0D2660]">Add Disclosure Link</h3>
        <Input placeholder="Section id (e.g. admissions_fee)" value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })} required />
        <Input placeholder="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
        <Input placeholder="Link URL (e.g. /admissions/fees)" value={form.link_url}
          onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
        <Input type="number" placeholder="Sort order" value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Save Item</Button>
      </form>

      <ul className="space-y-2">
        {items.map((d) => (
          <li key={d.id} className="bg-white border border-blue-50 rounded-lg p-4 text-sm">
            <span className="font-medium">{d.label}</span>
            <span className="text-gray-400 ml-2">({d.section})</span>
            {d.link_url && <span className="block text-xs text-[#0D2660] mt-1">{d.link_url}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
