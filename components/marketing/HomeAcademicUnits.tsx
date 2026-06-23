import Link from "next/link";
import { HOME_ACADEMIC_UNITS } from "@/lib/content/design-portal";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";

/** IIT Delhi — Academic Units row (Departments · Centres · Schools) */
export function HomeAcademicUnits() {
  return (
    <section className="home-section bg-white">
      <div className="container-site">
        <HomeSectionHeading title="Academic Units" viewAllHref="/academics" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {HOME_ACADEMIC_UNITS.map((unit) => (
            <Link
              key={unit.href}
              href={unit.href}
              className="group flex items-center justify-center min-h-[4.5rem] sm:min-h-[5.5rem] px-4 py-4 rounded-lg border-2 border-[#0D2660] bg-white text-center hover:bg-[#0D2660] transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-[#0D2660] group-hover:text-white leading-snug">
                {unit.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
