import Link from "next/link";
import { ExternalLink } from "lucide-react";

type Props = {
  href: string;
  label?: string;
  className?: string;
};

/** Opens the public site page in a new tab (admin content workflow). */
export function ContentPreviewLink({ href, label = "Preview", className = "" }: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-xs font-medium text-[#0D2660] hover:text-[#C8201A] transition-colors ${className}`}
    >
      {label}
      <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
}
