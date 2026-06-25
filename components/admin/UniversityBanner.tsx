import { GraduationCap, ExternalLink } from "lucide-react";

const UNIVERSITY_LINKS = [
  { label: "Bastar University", href: "https://smkvbastar.ac.in" },
  { label: "Samarth eGov", href: "https://samarth.edu.in" },
  { label: "Examination portal", href: "https://smkvbastar.ac.in/examination" },
];

export function UniversityBanner() {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 px-5 py-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
        <GraduationCap className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-950">University action may be required</p>
        <p className="text-xs text-amber-800/90 mt-0.5">
          Examination enrollment and registration may need to be completed on Bastar University / Samarth.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        {UNIVERSITY_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D2660] bg-white border border-amber-200/80 rounded-lg px-3 py-2 hover:border-[#0D2660] hover:shadow-sm transition-all"
          >
            <ExternalLink className="h-3 w-3" />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
