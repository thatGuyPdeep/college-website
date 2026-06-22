"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { importAttendanceCsv, importMarksCsv } from "@/lib/actions/admin-erp-import";
import { ATTENDANCE_CSV_TEMPLATE, MARKS_CSV_TEMPLATE } from "@/lib/erp/parse-csv";

function downloadTemplate(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ErpBulkImport() {
  const [loading, setLoading] = useState<"attendance" | "marks" | null>(null);
  const [lastResult, setLastResult] = useState<{ type: string; imported: number; skipped: number; errors: string[] } | null>(null);

  async function handleFile(type: "attendance" | "marks", file: File | null) {
    if (!file) {
      toast.error("Choose a CSV file");
      return;
    }
    setLoading(type);
    const text = await file.text();
    const result = type === "attendance"
      ? await importAttendanceCsv(text)
      : await importMarksCsv(text);
    setLoading(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setLastResult({ type, ...result.data });
    toast.success(`Imported ${result.data.imported} row(s)`);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <p className="text-sm text-gray-600">
        Upload CSV files to bulk-import attendance or marks. Identify students by <code className="text-xs">student_email</code> or <code className="text-xs">roll_number</code> (at least one required per row). Max 500 rows per file.
      </p>

      <section className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#0D2660]">Attendance import</h3>
        <p className="text-xs text-gray-500">
          Columns: student_email, roll_number, course_code, course_name, date (YYYY-MM-DD), status (present|absent|late)
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => downloadTemplate("attendance-template.csv", ATTENDANCE_CSV_TEMPLATE)}>
          Download template
        </Button>
        <input
          type="file"
          accept=".csv,text/csv"
          className="block text-sm"
          disabled={loading === "attendance"}
          onChange={(e) => void handleFile("attendance", e.target.files?.[0] ?? null)}
        />
      </section>

      <section className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#0D2660]">Marks import</h3>
        <p className="text-xs text-gray-500">
          Columns: student_email, roll_number, subject, exam_type, marks_obtained, max_marks, semester, academic_year
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => downloadTemplate("marks-template.csv", MARKS_CSV_TEMPLATE)}>
          Download template
        </Button>
        <input
          type="file"
          accept=".csv,text/csv"
          className="block text-sm"
          disabled={loading === "marks"}
          onChange={(e) => void handleFile("marks", e.target.files?.[0] ?? null)}
        />
      </section>

      {lastResult && (
        <div className="bg-gray-50 border rounded-xl p-4 text-sm">
          <div className="font-medium text-gray-900 mb-1 capitalize">{lastResult.type} import result</div>
          <div className="text-gray-600">
            {lastResult.imported} imported · {lastResult.skipped} skipped
          </div>
          {lastResult.errors.length > 0 && (
            <ul className="mt-2 text-xs text-amber-800 space-y-1 max-h-40 overflow-y-auto">
              {lastResult.errors.slice(0, 20).map((e) => (
                <li key={e}>{e}</li>
              ))}
              {lastResult.errors.length > 20 && (
                <li>…and {lastResult.errors.length - 20} more</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
