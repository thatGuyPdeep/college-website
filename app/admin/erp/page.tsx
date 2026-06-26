import { requirePermission } from "@/lib/auth/helpers";
import { ErpConsole } from "@/components/admin/ErpConsole";
import { ErpRecordsOverview } from "@/components/admin/ErpRecordsOverview";
import {
  listEnrolledStudents,
  listProgramOptions,
  getErpAdminSummary,
  listAdminAssignments,
  listGradingSubmissions,
  listErpNotices,
  listRecentAttendance,
  listRecentMarks,
  listTimetableSlots,
  listFeeRecords,
} from "@/lib/actions/admin-erp";

export default async function AdminErpPage() {
  await requirePermission("erp", "view");

  const [
    studentsResult,
    programsResult,
    summaryResult,
    assignmentsResult,
    submissionsResult,
    noticesResult,
    attendanceResult,
    marksResult,
    timetableResult,
    feesResult,
  ] = await Promise.all([
    listEnrolledStudents(),
    listProgramOptions(),
    getErpAdminSummary(),
    listAdminAssignments(),
    listGradingSubmissions(),
    listErpNotices(),
    listRecentAttendance(),
    listRecentMarks(),
    listTimetableSlots(),
    listFeeRecords(),
  ]);

  const students = studentsResult.ok ? studentsResult.data : [];
  const programs = programsResult.ok ? programsResult.data : [];
  const summary = summaryResult.ok
    ? summaryResult.data
    : { notices: 0, students: 0, assignments: 0, attendanceRecords: 0, marksEntries: 0, pendingFees: 0 };
  const assignments = assignmentsResult.ok ? assignmentsResult.data : [];
  const submissions = submissionsResult.ok ? submissionsResult.data : [];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">ERP Console</h1>
      <p className="text-sm text-gray-500 mb-6">
        Phase 2 student ERP — notices, attendance, marks, timetable, assignments, fees, and grading.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Students", value: summary.students },
          { label: "Notices", value: summary.notices },
          { label: "Assignments", value: summary.assignments },
          { label: "Attendance rows", value: summary.attendanceRecords },
          { label: "Marks entries", value: summary.marksEntries },
          { label: "Pending fees", value: summary.pendingFees },
        ].map((s) => (
          <div key={s.label} className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#0D2660]">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <ErpRecordsOverview
        notices={noticesResult.ok ? noticesResult.data : []}
        attendance={attendanceResult.ok ? attendanceResult.data : []}
        marks={marksResult.ok ? marksResult.data : []}
        timetable={timetableResult.ok ? timetableResult.data : []}
        fees={feesResult.ok ? feesResult.data : []}
        students={students}
      />

      <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Create &amp; manage records</h2>
      <ErpConsole
        students={students}
        programs={programs}
        assignments={assignments}
        submissions={submissions}
      />
    </div>
  );
}
