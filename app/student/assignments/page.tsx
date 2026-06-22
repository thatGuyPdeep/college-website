import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getErpPageData } from "@/lib/actions/erp";
import { AssignmentCard } from "@/components/student/AssignmentCard";

export const metadata: Metadata = { title: "Assignments" };

export default async function AssignmentsPage() {
  const data = await getErpPageData();
  if (!data.ok) redirect("/login?redirect=/student/assignments");

  const { assignments } = data;

  return (
    <>
      <h1 className="text-xl font-bold text-[#0D2660] mb-2">Assignments</h1>
      <p className="text-sm text-gray-500 mb-6">Upload PDF, DOC, or image files (max 10 MB).</p>
      {assignments.length === 0 ? (
        <p className="text-sm text-gray-500">No assignments posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </ul>
      )}
    </>
  );
}
