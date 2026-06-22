import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getErpPageData } from "@/lib/actions/erp";

export const metadata: Metadata = { title: "Attendance" };

export default async function AttendancePage() {
  const data = await getErpPageData();
  if (!data.ok) redirect("/login?redirect=/student/attendance");

  const { attendance } = data;

  return (
    <>
      <h1 className="text-xl font-bold text-[#0D2660] mb-6">Attendance</h1>
      {attendance.length === 0 ? (
        <p className="text-sm text-gray-500">No attendance records yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0D2660] text-white text-left">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a, i) => (
                <tr key={a.id} className={i % 2 ? "bg-blue-50/40" : ""}>
                  <td className="px-4 py-2">{new Date(a.date).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-2">{a.course_name ?? a.course_code}</td>
                  <td className="px-4 py-2 capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
