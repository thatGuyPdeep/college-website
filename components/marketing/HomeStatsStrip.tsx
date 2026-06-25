import { HOME_STATS } from "@/lib/content/design-portal";
import { AnimatedStat } from "@/components/marketing/AnimatedStat";

/** IIT Delhi — Students · Faculty · Staff counter strip with scroll-triggered animation */
export function HomeStatsStrip() {
  return (
    <section
      className="bg-[#0D2660] text-white parallax-stats"
      aria-label="Institution statistics"
    >
      <div className="container-site py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {HOME_STATS.map((stat) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
