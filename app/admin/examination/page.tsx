import Link from "next/link";
import { requirePermission } from "@/lib/auth/helpers";
import { listExamNotices } from "@/lib/actions/admin-examination";
import { UniversityBanner } from "@/components/admin/UniversityBanner";
import { ExamNoticeForm } from "@/components/admin/ExamNoticeForm";

export default async function AdminExaminationPage() {
  await requirePermission("examination", "view");
  const result = await listExamNotices();
  const notices = result.ok ? result.data : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Examination Console</h1>
      <p className="text-sm text-gray-500 mb-6">Publish exam notices and track college examination content</p>

      <UniversityBanner />

      <ExamNoticeForm />

      <h2 className="font-semibold text-gray-900 mt-10 mb-4">Examination notices</h2>
      {notices.length === 0 ? (
        <p className="text-sm text-gray-400">No examination notices yet.</p>
      ) : (
        <ul className="bg-white border border-blue-100 rounded-xl divide-y divide-blue-50">
          {notices.map((n) => (
            <li key={n.id} className="px-5 py-4 flex flex-wrap justify-between gap-2">
              <div>
                <Link href={`/news/${n.slug}`} className="font-medium text-[#0D2660] hover:underline">
                  {n.title}
                </Link>
                <p className="text-xs text-gray-400 mt-1">
                  {n.is_published ? "Published" : "Draft"}
                  {n.published_at && ` · ${new Date(n.published_at).toLocaleDateString("en-IN")}`}
                </p>
              </div>
              <a
                href={`/news/${n.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C8201A] hover:underline"
              >
                Preview public page
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
