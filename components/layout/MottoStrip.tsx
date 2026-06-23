import { INSTITUTION_MOTTO } from "@/lib/content/design-portal";

/** SMKV-style bilingual motto band below header */
export function MottoStrip() {
  return (
    <div className="bg-gradient-to-r from-[#0D2660] via-[#0D2660] to-[#071540] border-b border-[#F5C200]/30 text-center py-2 px-4">
      <p className="devanagari text-xs sm:text-sm font-semibold text-[#F5C200] leading-snug">
        {INSTITUTION_MOTTO.hindiTagline}
      </p>
      <p className="text-[10px] sm:text-xs text-blue-200 italic mt-0.5 max-w-3xl mx-auto leading-relaxed">
        {INSTITUTION_MOTTO.englishTagline}
      </p>
    </div>
  );
}
