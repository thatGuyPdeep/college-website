import Link from "next/link";
import { ACCREDITATION_ITEMS } from "@/lib/utils/constants";

/** Accreditation / affiliation strip — SMKV NAAC badge pattern */
export function HomeAccreditationStrip() {
  return (
    <section className="bg-[#F0F4FF] border-y border-blue-100" aria-label="Accreditation and affiliation">
      <div className="container-site py-3">
        <div className="scroll-strip flex items-center gap-3 sm:gap-4">
          {ACCREDITATION_ITEMS.map((item) => (
            <div
              key={item.name}
              className="shrink-0 inline-flex flex-col px-4 py-2 bg-white border border-blue-100 rounded-md shadow-sm min-w-[10rem]"
            >
              <span className="text-xs font-bold text-[#0D2660] uppercase tracking-wide">{item.name}</span>
              <span className="text-[10px] text-gray-500 mt-0.5 max-w-[14rem] leading-snug">{item.description}</span>
            </div>
          ))}
          <Link
            href="https://www.naac.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex flex-col px-4 py-2 bg-[#0D2660] text-white rounded-md min-w-[10rem] hover:bg-[#071540] transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wide">NAAC Framework</span>
            <span className="text-[10px] text-blue-100 mt-0.5">Quality assurance & accreditation</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
