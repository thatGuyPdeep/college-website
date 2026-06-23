import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

type MarketingPageProps = {
  title: string;
  description?: string;
  hindiTitle?: string;
  breadcrumbs?: Crumb[];
  children: React.ReactNode;
  className?: string;
};

export function MarketingPage({
  title,
  description,
  hindiTitle,
  breadcrumbs = [],
  children,
  className,
}: MarketingPageProps) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...breadcrumbs, { label: title }];

  return (
    <div className={cn("pb-16", className)}>
      <div className="navy-gradient text-white py-10 sm:py-14 border-b-4 border-[#F5C200]">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="text-sm text-blue-200 mb-4">
            <ol className="flex flex-wrap items-center gap-1">
              {crumbs.map((c, i) => (
                <li key={`${c.label}-${i}`} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" aria-hidden="true" />}
                  {c.href && i < crumbs.length - 1 ? (
                    <Link href={c.href} className="hover:text-[#F5C200] transition-colors">
                      {c.label}
                    </Link>
                  ) : (
                    <span className={i === crumbs.length - 1 ? "text-white font-medium" : undefined}>
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {hindiTitle && (
            <p className="devanagari text-[#F5C200] text-sm sm:text-base font-semibold mb-1">{hindiTitle}</p>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">{title}</h1>
          {description && (
            <p className="mt-3 text-blue-100 max-w-3xl text-sm sm:text-base leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      <div className="container-site py-10 sm:py-12">{children}</div>
    </div>
  );
}
