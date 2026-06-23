import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HomeSectionHeadingProps = {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  subtitle?: string;
  className?: string;
};

/** IIT Delhi — section title with optional “View all” link */
export function HomeSectionHeading({
  title,
  viewAllHref,
  viewAllLabel = "View all",
  subtitle,
  className = "",
}: HomeSectionHeadingProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 sm:mb-6 ${className}`}>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0D2660]">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#C8201A] hover:text-[#9B1812] shrink-0"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
