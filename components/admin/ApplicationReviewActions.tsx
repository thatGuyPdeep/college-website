"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  updateApplicationStatus,
  requestDocuments,
} from "@/lib/actions/admin-admissions";
import type { ApplicationStatus } from "@/lib/supabase/types";
import { REQUIRED_DOCUMENTS } from "@/lib/utils/constants";

interface Props {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function ApplicationReviewActions({ applicationId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading]   = useState(false);
  const [reason, setReason]     = useState("");
  const [docMsg, setDocMsg]     = useState("");
  const [docTypes, setDocTypes] = useState<string[]>([]);

  async function changeStatus(status: ApplicationStatus) {
    setLoading(true);
    try {
      const result = await updateApplicationStatus(applicationId, status, {
        reason: reason || undefined,
      });
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(`Application marked as ${status.replace("_", " ")}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestDocs() {
    if (!docTypes.length) { toast.error("Select at least one document type"); return; }
    if (!docMsg.trim()) { toast.error("Please add a message for the applicant"); return; }
    setLoading(true);
    try {
      const result = await requestDocuments(applicationId, docTypes, docMsg);
      if (!result.ok) { toast.error(result.error); return; }
      toast.success("Document request sent");
      setDocTypes([]);
      setDocMsg("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  function toggleDoc(type: string) {
    setDocTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-blue-100 p-5">
        <h3 className="font-semibold text-[#0D2660] mb-4">Update Status</h3>
        <div className="mb-4">
          <Label htmlFor="reason">Reason / note (optional)</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Message shown to the applicant…"
            className="mt-1.5"
            rows={3}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {currentStatus === "submitted" && (
            <Button
              disabled={loading}
              onClick={() => changeStatus("under_review")}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              Mark Under Review
            </Button>
          )}
          {["submitted", "under_review", "waitlisted"].includes(currentStatus) && (
            <>
              <Button disabled={loading} onClick={() => changeStatus("approved")}
                className="bg-green-700 hover:bg-green-800 text-white">
                Approve
              </Button>
              <Button disabled={loading} onClick={() => changeStatus("waitlisted")}
                variant="outline" className="border-orange-400 text-orange-700">
                Waitlist
              </Button>
              <Button disabled={loading} onClick={() => changeStatus("rejected")}
                variant="outline" className="border-red-400 text-red-700">
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-blue-100 p-5">
        <h3 className="font-semibold text-[#0D2660] mb-4">Request Additional Documents</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {REQUIRED_DOCUMENTS.map((d) => (
            <button
              key={d.type}
              type="button"
              onClick={() => toggleDoc(d.type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                docTypes.includes(d.type)
                  ? "bg-[#0D2660] text-white border-[#0D2660]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0D2660]"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <Textarea
          value={docMsg}
          onChange={(e) => setDocMsg(e.target.value)}
          placeholder="Explain what the applicant needs to upload…"
          rows={3}
          className="mb-3"
        />
        <Button
          disabled={loading}
          onClick={handleRequestDocs}
          variant="outline"
          className="border-[#0D2660] text-[#0D2660]"
        >
          Send Document Request
        </Button>
      </div>
    </div>
  );
}
