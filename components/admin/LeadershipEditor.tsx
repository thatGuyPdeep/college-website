"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  upsertLeadershipEntry,
  deleteLeadershipEntry,
  type LeadershipEntry,
} from "@/lib/actions/admin-site-content";

export function LeadershipEditor({ items }: { items: LeadershipEntry[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", title: "", body: "", image_url: "", sort_order: "0",
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await upsertLeadershipEntry({
      name: form.name,
      title: form.title,
      body: form.body,
      image_url: form.image_url || undefined,
      sort_order: Number(form.sort_order),
    });
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Leadership entry added");
    setForm({ name: "", title: "", body: "", image_url: "", sort_order: "0" });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this leadership entry?")) return;
    const result = await deleteLeadershipEntry(id);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Deleted");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={create} className="bg-white border border-blue-100 rounded-xl p-5 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Title / designation" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <textarea
          className="w-full border rounded-md p-3 text-sm min-h-[80px]"
          placeholder="Bio / description"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <Input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>
        <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Add entry</Button>
      </form>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="bg-white border border-blue-100 rounded-xl p-4">
            <div className="flex justify-between gap-3">
              <div>
                <div className="font-semibold text-[#0D2660]">{item.name}</div>
                <div className="text-sm text-[#C8201A]">{item.title}</div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.body}</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="text-red-600 shrink-0" onClick={() => void remove(item.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400">No leadership entries in database — static fallback is shown on /about.</p>
        )}
      </ul>
    </div>
  );
}
