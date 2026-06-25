"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upsertIqacDocument } from "@/lib/actions/admin-iqac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function IqacDocumentForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("aqar");
  const [year, setYear] = useState("2025-26");
  const [linkUrl, setLinkUrl] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await upsertIqacDocument({
      title,
      category,
      academic_year: year,
      link_url: linkUrl || undefined,
      is_published: publish,
    });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Document saved");
    setTitle("");
    setLinkUrl("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-[#0D2660]">Add IQAC document</h3>
      <div>
        <Label htmlFor="iqac-title">Title</Label>
        <Input id="iqac-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="iqac-cat">Category</Label>
          <Input id="iqac-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="iqac-year">Academic year</Label>
          <Input id="iqac-year" value={year} onChange={(e) => setYear(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="iqac-link">Link URL (PDF or drive link)</Label>
        <Input id="iqac-link" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="mt-1" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
        Publish on public IQAC page
      </label>
      <Button type="submit" disabled={loading} className="bg-[#0D2660]">
        {loading ? "Saving…" : "Save document"}
      </Button>
    </form>
  );
}
