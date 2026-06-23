import Link from "next/link";
import { FileText } from "lucide-react";
import type { PublicNewsItem } from "@/lib/content/public-data";
import { NewsPdfLink } from "@/components/marketing/NewsPdfLink";

/** SMKV-style dated notice list with category, size, and language tags */
export function NewsAnnouncementsPanel({ items }: { items: PublicNewsItem[] }) {
  const notices = items.filter((n) => n.category !== "Event").slice(0, 12);
  if (!notices.length) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-sm">
      <div className="bg-[#0D2660] px-4 sm:px-5 py-3 flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-white">News &amp; Announcements</h3>
        <Link href="/news" className="text-xs font-semibold text-[#F5C200] hover:underline">
          View All →
        </Link>
      </div>
      <ul className="divide-y divide-blue-50 max-h-[28rem] overflow-y-auto">
        {notices.map((n) => (
          <li key={n.slug} className="hover:bg-blue-50/50 transition-colors">
            <div className="px-4 sm:px-5 py-3 sm:py-3.5">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <time className="text-xs text-gray-400 font-medium">{n.date}</time>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-[#0D2660] border border-blue-100">
                  [{n.category}]
                </span>
                {n.language && (
                  <span className="text-[10px] text-gray-500">Language: {n.language}</span>
                )}
                {n.attachmentSize && (
                  <span className="text-[10px] text-gray-500">Size: {n.attachmentSize}</span>
                )}
              </div>
              <Link
                href={`/news/${n.slug}`}
                className="text-sm font-medium text-gray-800 hover:text-[#0D2660] leading-snug block"
              >
                {n.title}
              </Link>
              {n.attachmentUrl && (
                <div className="mt-2">
                  <NewsPdfLink
                    href={n.attachmentUrl}
                    label={n.attachmentLabel ?? "Download"}
                    size={n.attachmentSize ?? undefined}
                    language={n.language}
                    className="text-xs"
                  />
                </div>
              )}
              {!n.attachmentUrl && n.category === "Notice" && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-gray-400">
                  <FileText className="h-3 w-3" aria-hidden="true" /> Notice
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
