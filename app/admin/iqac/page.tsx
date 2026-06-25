import { requirePermission } from "@/lib/auth/helpers";
import { listIqacDocuments } from "@/lib/actions/admin-iqac";
import { IqacDocumentForm } from "@/components/admin/IqacDocumentForm";
import Link from "next/link";

export default async function AdminIqacPage() {
  await requirePermission("iqac", "view");
  const result = await listIqacDocuments();
  const docs = result.ok ? result.data : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">IQAC Evidence Vault</h1>
      <p className="text-sm text-gray-500 mb-8">
        NAAC / AQAR evidence documents. Published items appear on the public{" "}
        <Link href="/iqac" className="text-[#0D2660] underline">IQAC page</Link>.
      </p>

      <IqacDocumentForm />

      <h2 className="font-semibold text-gray-900 mt-10 mb-4">Documents</h2>
      {docs.length === 0 ? (
        <p className="text-sm text-gray-400">No IQAC documents yet.</p>
      ) : (
        <ul className="bg-white border border-blue-100 rounded-xl divide-y divide-blue-50">
          {docs.map((d) => (
            <li key={d.id} className="px-5 py-4">
              <div className="font-medium text-gray-900">{d.title}</div>
              <p className="text-xs text-gray-500 mt-1">
                {d.category} · {d.academic_year ?? "—"} · {d.is_published ? "Published" : "Draft"}
              </p>
              {(d.file_url || d.link_url) && (
                <a href={d.file_url ?? d.link_url ?? "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0D2660] underline mt-1 inline-block">
                  Open document
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
