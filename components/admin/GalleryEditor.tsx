"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertGalleryItem, deleteGalleryItem } from "@/lib/actions/admin-gallery";
import type { GalleryItem } from "@/lib/actions/admin-gallery";

const empty = {
  id: "",
  item_type: "photo" as "photo" | "video",
  title: "",
  media_ref: "",
  year: new Date().getFullYear().toString(),
  sort_order: "0",
  is_published: true,
};

export function GalleryEditor({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(empty);

  async function uploadPhoto(file: File) {
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/admin/gallery/upload", { method: "POST", body });
      const json = await res.json() as { ok?: boolean; publicUrl?: string; error?: string };
      if (!res.ok || !json.publicUrl) {
        toast.error(json.error ?? "Upload failed");
        return;
      }
      setForm((f) => ({ ...f, media_ref: json.publicUrl! }));
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function loadItem(item: GalleryItem) {
    setForm({
      id:           item.id,
      item_type:    item.item_type,
      title:        item.title,
      media_ref:    item.media_ref,
      year:         item.year ?? "",
      sort_order:   String(item.sort_order),
      is_published: item.is_published,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await upsertGalleryItem({
      ...(form.id ? { id: form.id } : {}),
      item_type:    form.item_type,
      title:        form.title,
      media_ref:    form.media_ref,
      year:         form.year,
      sort_order:   Number(form.sort_order) || 0,
      is_published: form.is_published,
    });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(form.id ? "Gallery item updated" : "Gallery item added");
    setForm(empty);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    setLoading(true);
    const result = await deleteGalleryItem(id);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        When the database has gallery items, they replace the default static photos/videos on <code className="text-xs">/gallery</code>.
        Photos use an image path (e.g. <code className="text-xs">/images/ev-republic-day-2024.jpg</code>) or upload below.
        Videos use a YouTube video ID (e.g. <code className="text-xs">1ylaFCSEWCc</code>).
      </p>

      <form onSubmit={save} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#0D2660]">{form.id ? "Edit item" : "Add gallery item"}</h3>
        <select
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={form.item_type}
          onChange={(e) => setForm({ ...form, item_type: e.target.value as "photo" | "video" })}
        >
          <option value="photo">Photo</option>
          <option value="video">YouTube video</option>
        </select>
        <Input placeholder="Title / caption" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input
          placeholder={form.item_type === "photo" ? "Image path or URL" : "YouTube video ID"}
          value={form.media_ref}
          onChange={(e) => setForm({ ...form, media_ref: e.target.value })}
          required
        />
        {form.item_type === "photo" && (
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadPhoto(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              className="gap-2"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload photo"}
            </Button>
            {form.media_ref.startsWith("http") && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.media_ref} alt="Preview" className="h-14 w-14 object-cover rounded border" />
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          <Input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Published
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Save</Button>
          {form.id && (
            <Button type="button" variant="outline" onClick={() => setForm(empty)}>Clear</Button>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="bg-white border border-blue-50 rounded-lg p-4 flex justify-between gap-4 items-start">
            <div>
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-gray-400">
                {item.item_type} · {item.media_ref.slice(0, 40)} · {item.is_published ? "Live" : "Hidden"}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button type="button" size="sm" variant="outline" onClick={() => loadItem(item)}>Edit</Button>
              <Button type="button" size="sm" variant="outline" className="text-red-700" onClick={() => void remove(item.id)}>Delete</Button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400">No CMS items — static gallery content is shown on /gallery</p>
        )}
      </ul>
    </div>
  );
}
