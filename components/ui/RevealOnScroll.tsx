"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Transition delay in ms */
  delay?: number;
  threshold?: number;
};

/** Fade-up when scrolled into view (fires once) */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  threshold = 0.12,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold);

  return (
    <div
      ref={ref}
      className={cn("micro-reveal", inView && "micro-reveal--visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Staggered fade-up for direct children */
export function StaggerReveal({
  children,
  className,
  threshold = 0.1,
}: Omit<RevealProps, "delay">) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold);

  return (
    <div
      ref={ref}
      className={cn("micro-stagger", inView && "micro-stagger--visible", className)}
    >
      {children}
    </div>
  );
}
