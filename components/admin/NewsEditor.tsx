"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertNewsEvent } from "@/lib/actions/admin-content";
import type { NewsEvent } from "@/lib/supabase/types";

export function NewsEditor({ items }: { items: NewsEvent[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", category: "Notice", body: "", is_published: false,
    attachment_url: "", attachment_label: "", language: "",
  });

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").slice(0, 60);
    const result = await upsertNewsEvent({
      ...form,
      slug,
      published_at: form.is_published ? new Date().toISOString() : null,
    });
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("News item saved");
    setForm({ title: "", slug: "", category: "Notice", body: "", is_published: false, attachment_url: "", attachment_label: "", language: "" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={publish} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#0D2660]">Add News / Notice</h3>
        <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <textarea className="w-full border rounded-md p-3 text-sm min-h-[100px]" placeholder="Body"
          value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <Input placeholder="Attachment URL (PDF or link)" value={form.attachment_url}
          onChange={(e) => setForm({ ...form, attachment_url: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Attachment label" value={form.attachment_label}
            onChange={(e) => setForm({ ...form, attachment_label: e.target.value })} />
          <Input placeholder="Language tag (EN / HI / EN+HI)" value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Publish immediately
        </label>
        <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Save</Button>
      </form>

      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id} className="bg-white border border-blue-50 rounded-lg p-4 flex justify-between gap-4">
            <div>
              <div className="font-medium text-sm">{n.title}</div>
              <div className="text-xs text-gray-400">{n.category} · {n.is_published ? "Published" : "Draft"}</div>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400">No news in database yet — static content shown on /news</p>}
      </ul>
    </div>
  );
}
