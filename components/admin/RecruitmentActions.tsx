"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateFacultyAppStatus } from "@/lib/actions/admin-recruitment";
import type { FacultyAppStatus } from "@/lib/supabase/types";

export function RecruitmentActions({ id, status }: { id: string; status: FacultyAppStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(next: FacultyAppStatus) {
    setLoading(true);
    const result = await updateFacultyAppStatus(id, next);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Marked as ${next.replace("_", " ")}`);
    router.refresh();
  }

  if (status === "rejected" || status === "accepted") {
    return <p className="text-xs text-gray-500">Final status — no further actions.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "submitted" && (
        <>
          <Button size="sm" disabled={loading} onClick={() => setStatus("shortlisted")} className="bg-green-700 text-white">
            Shortlist
          </Button>
          <Button size="sm" disabled={loading} variant="outline" onClick={() => setStatus("interview")} className="border-purple-400 text-purple-700">
            Interview
          </Button>
          <Button size="sm" disabled={loading} variant="outline" onClick={() => setStatus("rejected")} className="border-red-400 text-red-700">
            Reject
          </Button>
        </>
      )}
      {status === "shortlisted" && (
        <>
          <Button size="sm" disabled={loading} onClick={() => setStatus("interview")} className="bg-purple-700 text-white">
            Schedule Interview
          </Button>
          <Button size="sm" disabled={loading} variant="outline" onClick={() => setStatus("accepted")} className="border-green-500 text-green-700">
            Accept
          </Button>
          <Button size="sm" disabled={loading} variant="outline" onClick={() => setStatus("rejected")} className="border-red-400 text-red-700">
            Reject
          </Button>
        </>
      )}
      {status === "interview" && (
        <>
          <Button size="sm" disabled={loading} onClick={() => setStatus("accepted")} className="bg-green-700 text-white">
            Accept / Offer
          </Button>
          <Button size="sm" disabled={loading} variant="outline" onClick={() => setStatus("shortlisted")} className="border-green-400 text-green-700">
            Back to Shortlist
          </Button>
          <Button size="sm" disabled={loading} variant="outline" onClick={() => setStatus("rejected")} className="border-red-400 text-red-700">
            Reject
          </Button>
        </>
      )}
    </div>
  );
}
