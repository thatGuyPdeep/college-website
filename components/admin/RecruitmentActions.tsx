"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateFacultyAppStatus } from "@/lib/actions/admin-recruitment";
import type { FacultyAppStatus } from "@/lib/supabase/types";

export function RecruitmentActions({ id, status }: { id: string; status: FacultyAppStatus }) {
  const router = useRouter();

  async function setStatus(next: FacultyAppStatus) {
    const result = await updateFacultyAppStatus(id, next);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success(`Marked as ${next}`);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "submitted" && (
        <>
          <Button size="sm" onClick={() => setStatus("shortlisted")} className="bg-green-700 text-white">Shortlist</Button>
          <Button size="sm" variant="outline" onClick={() => setStatus("interview")} className="border-purple-400 text-purple-700">Interview</Button>
          <Button size="sm" variant="outline" onClick={() => setStatus("rejected")} className="border-red-400 text-red-700">Reject</Button>
        </>
      )}
      {status === "shortlisted" && (
        <Button size="sm" onClick={() => setStatus("interview")} className="bg-purple-700 text-white">Schedule Interview</Button>
      )}
    </div>
  );
}
