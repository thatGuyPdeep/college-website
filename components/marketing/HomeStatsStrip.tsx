import { HOME_STATS } from "@/lib/content/design-portal";

/** IIT Delhi — Students · Faculty · Staff counter strip */
export function HomeStatsStrip() {
  return (
    <section className="bg-[#0D2660] text-white" aria-label="Institution statistics">
      <div className="container-site py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {HOME_STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-bold text-[#F5C200]">{stat.value}</div>
              <div className="text-xs sm:text-sm text-blue-200 mt-1 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
