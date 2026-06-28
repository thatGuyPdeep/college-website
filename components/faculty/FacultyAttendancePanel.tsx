"use client";

import { useState, useTransition } from "react";
import {
  listStudentsForFacultyClass,
  recordFacultyStudentAttendance,
  type FacultyAttendanceSummary,
  type FacultyTimetableSlot,
} from "@/lib/actions/faculty-erp";

type Props = {
  displayName: string;
  timetable: FacultyTimetableSlot[];
  summaries: FacultyAttendanceSummary[];
  hasClasses: boolean;
};

export function FacultyAttendancePanel({ displayName, timetable, summaries, hasClasses }: Props) {
  const [pending, startTransition] = useTransition();
  const [selectedSubject, setSelectedSubject] = useState(timetable[0]?.subject ?? "");
  const [students, setStudents] = useState<{ userId: string; name: string | null; rollNumber: string | null }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const subjects = [...new Set(timetable.map((t) => t.subject))];

  function loadStudents(subject: string) {
    setSelectedSubject(subject);
    setMessage(null);
    startTransition(async () => {
      const res = await listStudentsForFacultyClass(subject);
      if (res.ok) setStudents(res.students);
      else setMessage(res.error ?? "Could not load students");
    });
  }

  function markAttendance(userId: string, status: "present" | "absent" | "late") {
    if (!selectedSubject) return;
    setMessage(null);
    const fd = new FormData();
    fd.set("user_id", userId);
    fd.set("course_code", selectedSubject);
    fd.set("course_name", selectedSubject);
    fd.set("date", date);
    fd.set("status", status);
    startTransition(async () => {
      const res = await recordFacultyStudentAttendance(fd);
      setMessage(res.ok ? "Attendance saved." : (res.error ?? "Failed"));
    });
  }

  return (
    <div className="space-y-10">
      <p className="text-sm text-gray-600">
        Signed in as <span className="font-semibold text-[#0D2660]">{displayName}</span>.
        Timetable slots must list your name under <span className="font-medium">faculty_name</span> (Admin → ERP).
      </p>

      <section>
        <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Your weekly timetable</h2>
        {!hasClasses ? (
          <p className="text-sm text-gray-500">
            No classes assigned yet. Ask the examination cell to add timetable slots with your name.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-blue-100">
              <thead className="bg-[#F0F4FF]">
                <tr>
                  <th className="text-left p-3">Day</th>
                  <th className="text-left p-3">Time</th>
                  <th className="text-left p-3">Subject</th>
                  <th className="text-left p-3">Programme</th>
                  <th className="text-left p-3">Room</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((t) => (
                  <tr key={t.id} className="border-t border-blue-50">
                    <td className="p-3">{t.dayLabel}</td>
                    <td className="p-3">{t.startTime}–{t.endTime}</td>
                    <td className="p-3 font-medium">{t.subject}</td>
                    <td className="p-3 text-gray-500">{t.programName ?? "—"}</td>
                    <td className="p-3 text-gray-500">{t.room ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {subjects.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Mark student attendance</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            {subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => loadStudents(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  selectedSubject === s
                    ? "bg-[#0D2660] text-white border-[#0D2660]"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {message && <p className="text-sm text-gray-600 mb-3">{message}</p>}

          {students.length > 0 ? (
            <ul className="space-y-2">
              {students.map((st) => (
                <li
                  key={st.userId}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-blue-100 bg-white text-sm"
                >
                  <span>
                    {st.name ?? "Student"}
                    {st.rollNumber && <span className="text-gray-400 ml-2">({st.rollNumber})</span>}
                  </span>
                  <div className="flex gap-2">
                    {(["present", "late", "absent"] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={pending}
                        onClick={() => markAttendance(st.userId, status)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold capitalize ${
                          status === "present"
                            ? "bg-green-100 text-green-800"
                            : status === "late"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : selectedSubject ? (
            <p className="text-sm text-gray-500">Select a subject above to load enrolled students.</p>
          ) : null}
        </section>
      )}

      {summaries.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Recent class attendance</h2>
          <ul className="space-y-2">
            {summaries.map((s) => (
              <li key={`${s.courseCode}-${s.date}`} className="p-3 rounded-lg border border-blue-100 text-sm flex flex-wrap justify-between gap-2">
                <span className="font-medium">{s.courseName} · {s.date}</span>
                <span className="text-gray-500">
                  Present {s.present} · Late {s.late} · Absent {s.absent}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
