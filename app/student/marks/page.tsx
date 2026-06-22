import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getErpPageData } from "@/lib/actions/erp";

export const metadata: Metadata = { title: "Marks" };

export default async function MarksPage() {
  const data = await getErpPageData();
  if (!data.ok) redirect("/login?redirect=/student/marks");

  const { marks } = data;

  return (
    <>
      <h1 className="text-xl font-bold text-[#0D2660] mb-6">Marks & Results</h1>
      {marks.length === 0 ? (
        <p className="text-sm text-gray-500">No marks published yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0D2660] text-white text-left">
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Exam</th>
                <th className="px-4 py-2">Marks</th>
                <th className="px-4 py-2">Semester</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, i) => (
                <tr key={m.id} className={i % 2 ? "bg-blue-50/40" : ""}>
                  <td className="px-4 py-2 font-medium">{m.subject}</td>
                  <td className="px-4 py-2">{m.exam_type ?? "—"}</td>
                  <td className="px-4 py-2">
                    {m.marks_obtained != null && m.max_marks != null
                      ? `${m.marks_obtained} / ${m.max_marks}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2">{m.semester ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
