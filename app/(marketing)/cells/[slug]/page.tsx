import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone, FileText, Users } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { STATUTORY_CELLS } from "@/lib/content/reference-portal";
import { getCellDetail } from "@/lib/content/statutory-cell-details";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return STATUTORY_CELLS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cell = STATUTORY_CELLS.find((c) => c.slug === slug);
  return { title: cell?.name ?? "Statutory Cell" };
}

export default async function CellDetailPage({ params }: Props) {
  const { slug } = await params;
  const cell = STATUTORY_CELLS.find((c) => c.slug === slug);
  if (!cell) notFound();

  const detail = getCellDetail(slug);

  return (
    <MarketingPage
      title={cell.name}
      hindiTitle={cell.hindi}
      description={cell.summary}
      breadcrumbs={[{ label: "Statutory Cells", href: "/cells" }]}
    >
      <div className="max-w-3xl space-y-8">
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>{cell.summary}</p>
          {detail?.extra && <p>{detail.extra}</p>}
          <p>
            This cell operates in accordance with UGC regulations and the policies of the affiliating
            university. Students, parents, and staff may submit grievances or requests in writing to
            the contact below.
          </p>
        </div>

        {detail?.responsibilities && (
          <section>
            <h2 className="font-bold text-[#0D2660] mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" aria-hidden="true" />
              Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {detail.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {detail?.members && (
          <section>
            <h2 className="font-bold text-[#0D2660] mb-3">Composition</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {detail.members.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        )}

        {detail?.documents && detail.documents.length > 0 && (
          <section>
            <h2 className="font-bold text-[#0D2660] mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" aria-hidden="true" />
              Documents & Forms
            </h2>
            <ul className="space-y-2">
              {detail.documents.map((doc) => (
                <li key={doc.href + doc.label}>
                  {doc.external ? (
                    <a href={doc.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#C8201A] font-medium hover:underline">
                      {doc.label} →
                    </a>
                  ) : (
                    <Link href={doc.href} className="text-sm text-[#C8201A] font-medium hover:underline">
                      {doc.label} →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="rounded-xl border border-blue-100 bg-[#F0F4FF] p-6 space-y-3">
          <h2 className="font-bold text-[#0D2660]">Contact</h2>
          <p className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-[#C8201A]" aria-hidden="true" />
            <a href={`mailto:${cell.contact}`} className="hover:underline">{cell.contact}</a>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-[#C8201A]" aria-hidden="true" />
            <a href="tel:+917781252251" className="hover:underline">07781-252251</a>
          </p>
        </div>

        {detail?.helpline && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-900 mb-2">Helpline</h2>
            <p className="text-sm text-red-800">{detail.helpline}</p>
          </div>
        )}

        {slug === "anti-ragging" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-900 mb-2">Anti-Ragging Helpline</h2>
            <p className="text-sm text-red-800">
              National Anti-Ragging Helpline: <strong>1800-180-5522</strong> (24×7) · email:{" "}
              <a href="mailto:helpline@antiragging.in" className="underline">helpline@antiragging.in</a>
            </p>
          </div>
        )}

        {slug === "iqac" && (
          <p className="text-sm">
            <Link href="/iqac" className="text-[#0D2660] font-semibold hover:underline">
              Visit full IQAC page (AQAR, feedback) →
            </Link>
          </p>
        )}

        <p className="text-sm">
          <Link href="/cells" className="text-[#0D2660] font-semibold hover:underline">
            ← All statutory cells
          </Link>
        </p>
      </div>
    </MarketingPage>
  );
}
