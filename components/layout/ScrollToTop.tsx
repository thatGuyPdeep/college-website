"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

/** IIT Delhi scroll-to-top control */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-4 z-40 flex flex-col items-center justify-center w-10 h-12 bg-[#0D2660] text-white text-[10px] hover:bg-[#B80F0A] transition-colors shadow-lg rounded-sm micro-scroll-top micro-press"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
