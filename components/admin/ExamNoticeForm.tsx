"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upsertExamNotice } from "@/lib/actions/admin-examination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function ExamNoticeForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [publish, setPublish] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const slug = slugify(title) || `exam-${Date.now()}`;
    const schedule = scheduledAt ? new Date(scheduledAt).toISOString() : null;
    const publishNow = publish && !schedule;

    const result = await upsertExamNotice({
      title,
      slug,
      body,
      is_published: publishNow,
      scheduled_publish_at: schedule,
    });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(
      publishNow ? "Notice published" : schedule ? "Notice scheduled" : "Draft saved",
    );
    setTitle("");
    setBody("");
    setPublish(false);
    setScheduledAt("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-[#0D2660]">New examination notice</h3>
      <div>
        <Label htmlFor="exam-title">Title</Label>
        <Input id="exam-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="exam-body">Body (HTML/markdown text)</Label>
        <textarea
          id="exam-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
        Publish immediately on public site
      </label>
      <div>
        <Label htmlFor="exam-schedule">Or schedule publish (optional)</Label>
        <Input
          id="exam-schedule"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="mt-1 max-w-xs"
        />
        <p className="text-xs text-gray-400 mt-1">
          Scheduled notices go live automatically when the cron job runs.
        </p>
      </div>
      <Button type="submit" disabled={loading} className="bg-[#C8201A] hover:bg-[#9B1812]">
        {loading ? "Saving…" : publish ? "Publish notice" : scheduledAt ? "Schedule notice" : "Save draft"}
      </Button>
    </form>
  );
}
