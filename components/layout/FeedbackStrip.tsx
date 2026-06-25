import { Mail } from "lucide-react";
import { FEEDBACK_EMAIL } from "@/lib/content/design-portal";

/** SMKV-style prominent feedback email band above footer */
export function FeedbackStrip() {
  return (
    <section className="bg-[#0D2660] border-y border-[#F5C200]/20 py-3 sm:py-4 text-center">
      <div className="container-site-compact">
        <p className="text-xs text-blue-200 mb-1">Send your comments / feedback</p>
        <a
          href={`mailto:${FEEDBACK_EMAIL}`}
          className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-[#F5C200] hover:text-white transition-colors break-all"
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
          {FEEDBACK_EMAIL}
        </a>
      </div>
    </section>
  );
}
