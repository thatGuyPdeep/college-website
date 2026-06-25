"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addApplicationNote } from "@/lib/actions/admin-application-notes";
import type { InternalNote } from "@/lib/actions/admin-application-notes";
import { Button } from "@/components/ui/button";

export function ApplicationInternalNotes({
  applicationId,
  initialNotes,
}: {
  applicationId: string;
  initialNotes: InternalNote[];
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await addApplicationNote(applicationId, body);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Note added");
    setBody("");
    router.refresh();
  }

  return (
    <section className="bg-white rounded-xl border border-blue-100 p-6 mt-6">
      <h2 className="font-semibold text-[#0D2660] mb-4">Internal notes (staff only)</h2>
      {notes.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">No internal notes yet.</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {notes.map((n) => (
            <li key={n.id} className="text-sm border-l-2 border-[#0D2660]/30 pl-3">
              <p className="text-gray-800">{n.body}</p>
              <p className="text-xs text-gray-400 mt-1">
                {n.author_name ?? "Staff"} · {new Date(n.created_at).toLocaleString("en-IN")}
              </p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a note visible only to staff…"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          required
        />
        <Button type="submit" disabled={loading} size="sm" className="bg-[#0D2660]">
          {loading ? "Saving…" : "Add note"}
        </Button>
      </form>
    </section>
  );
}
