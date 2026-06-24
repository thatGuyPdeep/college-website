import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Clock, Award, Download, ClipboardList, ClipboardCheck, Phone } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { EXAMINATION_SECTIONS } from "@/lib/content/reference-portal";
import { EXAM_NOTICES } from "@/lib/content/examination-portal";
import { getPublicNews } from "@/lib/content/public-data";

export const metadata: Metadata = {
  title: "Examination",
  description: "Examination notices, enrollment, time tables, results, and forms — Ramakrishna Mission College, Narayanpur.",
};

const ICONS = [FileText, ClipboardList, Clock, Award, Download, ClipboardCheck, Phone];

export default async function ExaminationPage() {
  const news = await getPublicNews(20);
  const examNews = news.filter(
    (n) =>
      n.category === "Notice" &&
      (n.title.toLowerCase().includes("exam") ||
        n.title.toLowerCase().includes("semester") ||
        n.slug.includes("exam"))
  );
  const recentNotices =
    examNews.length > 0
      ? examNews.slice(0, 5).map((n) => ({
          key: n.slug,
          title: n.title,
          date: n.date,
          href: `/news/${n.slug}`,
        }))
      : EXAM_NOTICES.slice(0, 5).map((n) => ({
          key: n.href,
          title: n.title,
          date: n.date ?? "",
          href: n.href,
        }));

  return (
    <MarketingPage
      title="Examination"
      hindiTitle="परीक्षा"
      description="Notices, enrollment, examination forms, time tables, results, revaluation, and downloads."
      breadcrumbs={[]}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {EXAMINATION_SECTIONS.map((section, i) => {
          const Icon = ICONS[i] ?? FileText;
          return (
            <section key={section.title} className="rounded-2xl border border-blue-100 bg-white p-6 card-lift">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#F0F4FF]">
                  <Icon className="h-5 w-5 text-[#0D2660]" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-bold text-[#0D2660]">{section.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#C8201A] font-medium hover:underline"
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section id="question-papers" className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-bold text-[#0D2660] mb-2">Examination Control Room</h2>
        <p className="text-sm text-gray-600 mb-4">
          For examination-related queries contact the college office during working hours.
          Email: rkm.narainpur@gmail.com · Phone: 07781-252251
        </p>
        <Link href="/examination/helpline" className="text-sm font-semibold text-[#C8201A] hover:underline">
          Full helpline details →
        </Link>
      </section>

      {recentNotices.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#0D2660] mb-4">Recent Examination Notices</h2>
          <ul className="divide-y border rounded-xl overflow-hidden bg-white">
            {recentNotices.map((n) => (
              <li key={n.key}>
                <Link href={n.href} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 hover:bg-blue-50 transition-colors">
                  <span className="font-medium text-gray-800">{n.title}</span>
                  <span className="text-xs text-gray-400 shrink-0">{n.date}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/examination/notices" className="inline-block mt-3 text-sm font-semibold text-[#C8201A] hover:underline">
            All examination notices →
          </Link>
        </section>
      )}
    </MarketingPage>
  );
}
