"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AssignmentWithSubmission } from "@/lib/actions/erp";

export function AssignmentCard({ assignment }: { assignment: AssignmentWithSubmission }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isPastDue = assignment.due_at ? new Date(assignment.due_at) < new Date() : false;
  const submitted = assignment.submission != null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPastDue) {
      toast.error("Deadline has passed");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File | null;
    if (!file?.size) {
      toast.error("Choose a file to upload");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append("assignment_id", assignment.id);
      body.append("file", file);

      const res = await fetch("/api/erp/upload", { method: "POST", body });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Upload failed");
        return;
      }
      toast.success("Assignment submitted");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className="border border-blue-100 rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <h2 className="font-semibold text-gray-900">{assignment.title}</h2>
        {submitted && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Submitted</span>
        )}
        {isPastDue && !submitted && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Closed</span>
        )}
      </div>
      {assignment.description && (
        <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{assignment.description}</p>
      )}
      {assignment.due_at && (
        <p className="text-xs text-gray-400 mt-2">
          Due: {new Date(assignment.due_at).toLocaleString("en-IN")}
        </p>
      )}
      {submitted && assignment.submission && (
        <p className="text-xs text-green-700 mt-2">
          Submitted {new Date(assignment.submission.submitted_at).toLocaleString("en-IN")}
          {assignment.submission.grade && ` · Grade: ${assignment.submission.grade}`}
        </p>
      )}
      {!submitted && !isPastDue && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required className="text-sm" />
          </div>
          <Button type="submit" size="sm" disabled={loading} className="bg-[#0D2660] text-white">
            {loading ? "Uploading…" : "Submit"}
          </Button>
        </form>
      )}
    </li>
  );
}
