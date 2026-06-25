import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HomeSectionHeadingProps = {
  title: string;
  accent?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  subtitle?: string;
  className?: string;
  /** IITD homepage sections use centered uppercase titles with double-line divider */
  variant?: "default" | "centered";
};

/** IIT Delhi — section title with optional accent word and double-line divider */
export function HomeSectionHeading({
  title,
  accent,
  viewAllHref,
  viewAllLabel = "View all",
  subtitle,
  className = "",
  variant = "default",
}: HomeSectionHeadingProps) {
  if (variant === "centered") {
    const parts = accent ? title.split(accent) : [title];
    return (
      <div className={`text-center mb-8 sm:mb-10 ${className}`}>
        <h2 className="iitd-section-title font-heading text-[#0D2660] uppercase tracking-wide">
          {parts[0]}
          {accent && <span className="text-[#B80F0A]">{accent}</span>}
          {parts[1] ?? ""}
        </h2>
        <div className="iitd-double-line mx-auto mt-3" aria-hidden="true" />
        {subtitle && <p className="text-sm text-gray-500 mt-3 max-w-2xl mx-auto">{subtitle}</p>}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#B80F0A] hover:text-[#9B1812]"
          >
            {viewAllLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 sm:mb-6 ${className}`}>
      <div>
        <h2 className="text-lg sm:text-xl font-heading font-bold text-[#0D2660] uppercase tracking-wide">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#B80F0A] hover:text-[#9B1812] shrink-0"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
