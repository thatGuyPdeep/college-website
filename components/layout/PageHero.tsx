import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, className, children }: PageHeroProps) {
  return (
    <section className={cn("page-hero", className)}>
      <div className="gold-gradient h-1 absolute bottom-0 left-0 right-0" aria-hidden="true" />
      <div className="container-site relative">
        {eyebrow && (
          <Badge className="mb-4 bg-white/10 text-[#F5C200] border-[#F5C200]/40 text-xs uppercase tracking-wide font-semibold">
            {eyebrow}
          </Badge>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-balance max-w-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-blue-200 text-base sm:text-lg max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
