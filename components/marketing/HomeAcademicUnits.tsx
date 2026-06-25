import Link from "next/link";
import { Building2, Layers, Wrench, Award } from "lucide-react";
import { HOME_ACADEMIC_UNITS } from "@/lib/content/design-portal";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";

const UNIT_ICONS = [Building2, Layers, Wrench, Award] as const;

/** IIT Delhi — Academic Units with icon-circled boxes */
export function HomeAcademicUnits() {
  return (
    <section className="home-section iitd-silver-deep">
      <div className="container-site">
        <HomeSectionHeading
          variant="centered"
          title="Academic "
          accent="Units"
          viewAllHref="/academics"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HOME_ACADEMIC_UNITS.map((unit, i) => {
            const Icon = UNIT_ICONS[i] ?? Building2;
            return (
              <Link
                key={unit.href}
                href={unit.href}
                className="iitd-unit-box group flex flex-col items-center text-center bg-white p-5 sm:p-6 border border-gray-200 hover:border-[#B80F0A] transition-all"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#0D2660] text-[#0D2660] group-hover:bg-[#B80F0A] group-hover:border-[#B80F0A] group-hover:text-white transition-colors mb-3">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#0D2660] group-hover:text-[#B80F0A] uppercase tracking-wide leading-snug transition-colors">
                  {unit.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
