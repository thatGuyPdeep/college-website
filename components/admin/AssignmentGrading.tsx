"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gradeSubmission } from "@/lib/actions/admin-erp";
import type { AdminAssignment, GradingSubmission } from "@/lib/actions/admin-erp";

export function AssignmentGrading({
  submissions,
  assignments,
  programs,
}: {
  submissions: GradingSubmission[];
  assignments: AdminAssignment[];
  programs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, string>>(() =>
    Object.fromEntries(submissions.map((s) => [s.id, s.grade ?? ""]))
  );
  const [filterAssignment, setFilterAssignment] = useState("");
  const [filterProgram, setFilterProgram] = useState("");

  const filtered = submissions.filter((s) => {
    if (filterAssignment && s.assignment_id !== filterAssignment) return false;
    if (filterProgram) {
      const a = assignments.find((x) => x.id === s.assignment_id);
      if (a?.program_id !== filterProgram) return false;
    }
    return true;
  });

  async function saveGrade(submissionId: string) {
    const grade = grades[submissionId]?.trim();
    if (!grade) {
      toast.error("Enter a grade");
      return;
    }
    setLoadingId(submissionId);
    const result = await gradeSubmission(submissionId, grade);
    setLoadingId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Grade saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filterProgram}
          onChange={(e) => setFilterProgram(e.target.value)}
        >
          <option value="">All programmes</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select
          className="border rounded-md px-3 py-2 text-sm min-w-[200px]"
          value={filterAssignment}
          onChange={(e) => setFilterAssignment(e.target.value)}
        >
          <option value="">All assignments</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} ({a.submission_count})
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 bg-gray-50 border rounded-lg p-4">
          No submissions yet. Students submit files from the student portal.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((s) => (
            <li key={s.id} className="bg-white border border-blue-100 rounded-xl p-4">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <div>
                  <div className="font-medium text-sm text-gray-900">{s.assignment_title}</div>
                  <div className="text-xs text-gray-500">
                    {s.student_name ?? s.student_email ?? s.user_id.slice(0, 8)}
                    {s.roll_number && ` · Roll ${s.roll_number}`}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(s.submitted_at).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-2 mt-3">
                {s.file_path && (
                  <a
                    href={`/api/erp/download?submission_id=${s.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#0D2660] underline"
                  >
                    Download file
                  </a>
                )}
                <Input
                  className="w-24 h-8 text-sm"
                  placeholder="Grade"
                  value={grades[s.id] ?? ""}
                  onChange={(e) => setGrades({ ...grades, [s.id]: e.target.value })}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={loadingId === s.id}
                  className="bg-[#0D2660] text-white"
                  onClick={() => void saveGrade(s.id)}
                >
                  {loadingId === s.id ? "Saving…" : "Save grade"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
