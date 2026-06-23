import Link from "next/link";
import { Download, FileText } from "lucide-react";

type NewsPdfLinkProps = {
  href: string;
  label?: string;
  size?: string;
  language?: string | null;
  className?: string;
};

export function NewsPdfLink({
  href,
  label = "Download PDF",
  size,
  language,
  className = "",
}: NewsPdfLinkProps) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-2 text-sm font-semibold text-[#C8201A] hover:underline ${className}`}
    >
      <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
      {size && <span className="text-xs text-gray-400 font-normal">({size})</span>}
      {language && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-[#0D2660] font-medium">
          {language}
        </span>
      )}
      <Download className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
    </Link>
  );
}
