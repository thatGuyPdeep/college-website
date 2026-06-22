"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  upsertPublicationLink,
  deletePublicationLink,
  seedSiteContentFromStatic,
  type PublicationLink,
} from "@/lib/actions/admin-site-content";

const SECTIONS = [
  { value: "english", label: "English section" },
  { value: "indian_language", label: "Indian language" },
  { value: "highlight", label: "Essential book highlight" },
] as const;

export function PublicationsEditor({ items }: { items: PublicationLink[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    section: "english" as PublicationLink["section"],
    label: "",
    href: "",
    sort_order: "0",
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await upsertPublicationLink({
      ...form,
      sort_order: Number(form.sort_order) || 0,
    });
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Link added");
    setForm({ section: "english", label: "", href: "", sort_order: "0" });
    router.refresh();
  }

  async function seed() {
    setLoading(true);
    const result = await seedSiteContentFromStatic();
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Seeded from static defaults");
    router.refresh();
  }

  async function remove(id: string) {
    const result = await deletePublicationLink(id);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Deleted");
    router.refresh();
  }

  const grouped = SECTIONS.map((s) => ({
    ...s,
    links: items.filter((i) => i.section === s.value),
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={loading} onClick={() => void seed()}>
          Seed from static defaults
        </Button>
        <p className="text-xs text-gray-500 self-center">Run migration 014 first if tables are missing.</p>
      </div>

      <form onSubmit={create} className="bg-white border border-blue-100 rounded-xl p-5 space-y-3">
        <select
          className="w-full border rounded-md p-2 text-sm"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value as PublicationLink["section"] })}
        >
          {SECTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <Input placeholder="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
        <Input placeholder="URL" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} required />
        <Input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Add link</Button>
      </form>

      {grouped.map((group) => (
        <div key={group.value}>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{group.label}</h4>
          <ul className="space-y-2">
            {group.links.map((link) => (
              <li key={link.id} className="flex items-center justify-between gap-2 bg-white border border-blue-50 rounded-lg px-3 py-2 text-sm">
                <span className="truncate">{link.label}</span>
                <Button type="button" variant="ghost" size="sm" className="text-red-600 shrink-0" onClick={() => void remove(link.id)}>
                  Delete
                </Button>
              </li>
            ))}
            {group.links.length === 0 && <li className="text-xs text-gray-400">None — static fallback used on library page.</li>}
          </ul>
        </div>
      ))}
    </div>
  );
}
