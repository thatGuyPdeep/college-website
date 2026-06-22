"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  publishErpNotice,
  recordAttendance,
  publishMark,
  addTimetableSlot,
  createAssignment,
  updateEnrolmentRoll,
} from "@/lib/actions/admin-erp";
import type {
  EnrolledStudent,
  ProgramOption,
  AdminAssignment,
  GradingSubmission,
} from "@/lib/actions/admin-erp";
import { AssignmentGrading } from "@/components/admin/AssignmentGrading";
import { ErpBulkImport } from "@/components/admin/ErpBulkImport";

type Tab = "notices" | "attendance" | "marks" | "timetable" | "assignments" | "submissions" | "enrolments" | "import";

interface Props {
  students: EnrolledStudent[];
  programs: ProgramOption[];
  assignments: AdminAssignment[];
  submissions: GradingSubmission[];
}

const TABS: { id: Tab; label: string }[] = [
  { id: "notices", label: "Notices" },
  { id: "attendance", label: "Attendance" },
  { id: "marks", label: "Marks" },
  { id: "timetable", label: "Timetable" },
  { id: "assignments", label: "Assignments" },
  { id: "submissions", label: "Submissions" },
  { id: "enrolments", label: "Enrolments" },
  { id: "import", label: "Bulk import" },
];

export function ErpConsole({ students, programs, assignments, submissions }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("notices");
  const [loading, setLoading] = useState(false);

  const [notice, setNotice] = useState({ title: "", body: "", audience: "student" });
  const [attendance, setAttendance] = useState<{
    user_id: string;
    course_code: string;
    course_name: string;
    date: string;
    status: "present" | "absent" | "late";
  }>({
    user_id: "", course_code: "", course_name: "", date: new Date().toISOString().slice(0, 10), status: "present",
  });
  const [mark, setMark] = useState({
    user_id: "", subject: "", exam_type: "Internal", marks_obtained: "", max_marks: "100", semester: "1", academic_year: "2026-27",
  });
  const [slot, setSlot] = useState({
    program_id: "", day_of_week: "1", start_time: "09:00", end_time: "10:00", subject: "", room: "", faculty_name: "",
  });
  const [assignment, setAssignment] = useState({
    program_id: "", title: "", description: "", due_at: "",
  });
  const [rollEdits, setRollEdits] = useState<Record<string, string>>(() =>
    Object.fromEntries(students.map((s) => [s.user_id, s.roll_number ?? ""]))
  );

  async function submit(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setLoading(true);
    const result = await fn();
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Saved");
    router.refresh();
  }

  const needsStudents = tab === "attendance" || tab === "marks" || tab === "enrolments";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="ERP console sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`erp-panel-${t.id}`}
            id={`erp-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              tab === t.id ? "bg-[#0D2660] text-white border-[#0D2660]" : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {t.label}
            {t.id === "submissions" && submissions.length > 0 && (
              <span className="ml-1.5 text-xs opacity-80">({submissions.length})</span>
            )}
          </button>
        ))}
      </div>

      {students.length === 0 && needsStudents && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          No enrolled students yet. Approve admissions to create enrolments, or run migration 006/008 in Supabase.
        </p>
      )}

      {tab === "notices" && (
        <div id="erp-panel-notices" role="tabpanel" aria-labelledby="erp-tab-notices">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(() => publishErpNotice(notice));
          }}
          className="bg-white border border-blue-100 rounded-xl p-5 space-y-4 max-w-lg"
        >
          <Input placeholder="Notice title" value={notice.title} onChange={(e) => setNotice({ ...notice, title: e.target.value })} required />
          <textarea className="w-full border rounded-md p-3 text-sm min-h-[80px]" placeholder="Body"
            value={notice.body} onChange={(e) => setNotice({ ...notice, body: e.target.value })} />
          <select className="w-full border rounded-md p-2 text-sm" value={notice.audience}
            onChange={(e) => setNotice({ ...notice, audience: e.target.value })}>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="all">All</option>
          </select>
          <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Publish Notice</Button>
        </form>
        </div>
      )}

      {tab === "attendance" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(() => recordAttendance(attendance));
          }}
          className="bg-white border border-blue-100 rounded-xl p-5 space-y-4 max-w-lg"
        >
          <select className="w-full border rounded-md p-2 text-sm" value={attendance.user_id} required
            onChange={(e) => setAttendance({ ...attendance, user_id: e.target.value })}>
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.user_id} value={s.user_id}>
                {s.full_name ?? s.email} {s.roll_number ? `(${s.roll_number})` : ""}
              </option>
            ))}
          </select>
          <Input placeholder="Course code" value={attendance.course_code}
            onChange={(e) => setAttendance({ ...attendance, course_code: e.target.value })} required />
          <Input placeholder="Course name (optional)" value={attendance.course_name}
            onChange={(e) => setAttendance({ ...attendance, course_name: e.target.value })} />
          <Input type="date" value={attendance.date}
            onChange={(e) => setAttendance({ ...attendance, date: e.target.value })} required />
          <select className="w-full border rounded-md p-2 text-sm" value={attendance.status}
            onChange={(e) => setAttendance({ ...attendance, status: e.target.value as "present" | "absent" | "late" })}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
          <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Record Attendance</Button>
        </form>
      )}

      {tab === "marks" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(() => publishMark({
              ...mark,
              marks_obtained: Number(mark.marks_obtained),
              max_marks:      Number(mark.max_marks),
              semester:       Number(mark.semester),
            }));
          }}
          className="bg-white border border-blue-100 rounded-xl p-5 space-y-4 max-w-lg"
        >
          <select className="w-full border rounded-md p-2 text-sm" value={mark.user_id} required
            onChange={(e) => setMark({ ...mark, user_id: e.target.value })}>
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.user_id} value={s.user_id}>{s.full_name ?? s.email}</option>
            ))}
          </select>
          <Input placeholder="Subject" value={mark.subject} onChange={(e) => setMark({ ...mark, subject: e.target.value })} required />
          <Input placeholder="Exam type" value={mark.exam_type} onChange={(e) => setMark({ ...mark, exam_type: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Marks obtained" value={mark.marks_obtained}
              onChange={(e) => setMark({ ...mark, marks_obtained: e.target.value })} required />
            <Input type="number" placeholder="Max marks" value={mark.max_marks}
              onChange={(e) => setMark({ ...mark, max_marks: e.target.value })} required />
          </div>
          <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Publish Marks</Button>
        </form>
      )}

      {tab === "timetable" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(() => addTimetableSlot({
              ...slot,
              day_of_week: Number(slot.day_of_week),
            }));
          }}
          className="bg-white border border-blue-100 rounded-xl p-5 space-y-4 max-w-lg"
        >
          <select className="w-full border rounded-md p-2 text-sm" value={slot.program_id} required
            onChange={(e) => setSlot({ ...slot, program_id: e.target.value })}>
            <option value="">Select programme</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select className="w-full border rounded-md p-2 text-sm" value={slot.day_of_week}
            onChange={(e) => setSlot({ ...slot, day_of_week: e.target.value })}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <option key={d} value={String(i + 1)}>{d}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <Input type="time" value={slot.start_time} onChange={(e) => setSlot({ ...slot, start_time: e.target.value })} required />
            <Input type="time" value={slot.end_time} onChange={(e) => setSlot({ ...slot, end_time: e.target.value })} required />
          </div>
          <Input placeholder="Subject" value={slot.subject} onChange={(e) => setSlot({ ...slot, subject: e.target.value })} required />
          <Input placeholder="Room" value={slot.room} onChange={(e) => setSlot({ ...slot, room: e.target.value })} />
          <Input placeholder="Faculty name" value={slot.faculty_name} onChange={(e) => setSlot({ ...slot, faculty_name: e.target.value })} />
          <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Add Slot</Button>
        </form>
      )}

      {tab === "assignments" && (
        <div className="space-y-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit(() => createAssignment({
                ...assignment,
                due_at: assignment.due_at || undefined,
              }));
            }}
            className="bg-white border border-blue-100 rounded-xl p-5 space-y-4 max-w-lg"
          >
            <h3 className="font-semibold text-[#0D2660]">Create assignment</h3>
            <select className="w-full border rounded-md p-2 text-sm" value={assignment.program_id} required
              onChange={(e) => setAssignment({ ...assignment, program_id: e.target.value })}>
              <option value="">Select programme</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Input placeholder="Assignment title" value={assignment.title}
              onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} required />
            <textarea className="w-full border rounded-md p-3 text-sm min-h-[80px]" placeholder="Description"
              value={assignment.description} onChange={(e) => setAssignment({ ...assignment, description: e.target.value })} />
            <Input type="datetime-local" value={assignment.due_at}
              onChange={(e) => setAssignment({ ...assignment, due_at: e.target.value })} />
            <Button type="submit" disabled={loading} className="bg-[#0D2660] text-white">Create Assignment</Button>
          </form>

          {assignments.length > 0 && (
            <ul className="space-y-2 max-w-lg">
              <h3 className="font-semibold text-gray-900 text-sm">Recent assignments</h3>
              {assignments.map((a) => (
                <li key={a.id} className="bg-white border border-blue-50 rounded-lg p-3 text-sm flex justify-between gap-2">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-xs text-gray-400">
                      {a.program_name ?? "—"} · {a.submission_count} submission{a.submission_count !== 1 ? "s" : ""}
                    </div>
                  </div>
                  {a.due_at && (
                    <div className="text-xs text-gray-400 shrink-0">
                      Due {new Date(a.due_at).toLocaleDateString("en-IN")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "submissions" && (
        <AssignmentGrading
          submissions={submissions}
          assignments={assignments}
          programs={programs}
        />
      )}

      {tab === "enrolments" && (
        <ul className="space-y-3 max-w-lg">
          {students.map((s) => (
            <li key={s.user_id} className="bg-white border border-blue-100 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-900 mb-1">{s.full_name ?? s.email}</div>
              <div className="text-xs text-gray-500 mb-3">{s.program_name ?? "No programme"}</div>
              <div className="flex gap-2">
                <Input
                  className="h-8 text-sm flex-1"
                  placeholder="Roll number"
                  value={rollEdits[s.user_id] ?? ""}
                  onChange={(e) => setRollEdits({ ...rollEdits, [s.user_id]: e.target.value })}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={loading}
                  className="bg-[#0D2660] text-white shrink-0"
                  onClick={() => void submit(() => updateEnrolmentRoll(s.user_id, rollEdits[s.user_id] ?? ""))}
                >
                  Save
                </Button>
              </div>
            </li>
          ))}
          {students.length === 0 && (
            <p className="text-sm text-gray-500">No active enrolments.</p>
          )}
        </ul>
      )}

      {tab === "import" && <ErpBulkImport />}
    </div>
  );
}
