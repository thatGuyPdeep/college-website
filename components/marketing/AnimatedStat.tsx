"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

function parseStatValue(raw: string): { target: number; suffix: string } {
  const match = raw.match(/^([\d,]+)(.*)$/);
  if (!match) return { target: 0, suffix: raw };
  return {
    target: parseInt(match[1].replace(/,/g, ""), 10),
    suffix: match[2] ?? "",
  };
}

type AnimatedStatProps = {
  value: string;
  label: string;
};

/** IIT Delhi Odometer-style counter — animates when scrolled into view */
export function AnimatedStat({ value, label }: AnimatedStatProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const { target, suffix } = parseStatValue(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || target === 0) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(target);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, target]);

  const formatted = display.toLocaleString("en-IN");

  return (
    <div ref={ref}>
      <div className="text-3xl sm:text-4xl font-bold text-[#F5C200] tabular-nums">
        {formatted}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm text-blue-200 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}
