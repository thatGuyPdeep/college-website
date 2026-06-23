import { getPublicNews } from "@/lib/content/public-data";
import { UrgentNoticeModal } from "@/components/marketing/UrgentNoticeModal";
import { HomeHeroPortals } from "@/components/marketing/HomeHeroPortals";
import { HomeImportantAnnouncements } from "@/components/marketing/HomeImportantAnnouncements";
import { HomeAboutSection } from "@/components/marketing/HomeAboutSection";
import { HomeDirectorsCorner } from "@/components/marketing/HomeDirectorsCorner";
import { HomeAcademicUnits } from "@/components/marketing/HomeAcademicUnits";
import { HomeNewsEventsGrid } from "@/components/marketing/HomeNewsEventsGrid";
import { HomeStatsStrip } from "@/components/marketing/HomeStatsStrip";
import { HomeGalleryPreview } from "@/components/marketing/HomeGalleryPreview";
import { URGENT_HOME_NOTICE } from "@/lib/content/reference-portal";

/** IIT Delhi–inspired home page — portal tiles, announcements, about, news columns, gallery */
export default async function Home() {
  const news = await getPublicNews(16);
  const events = news.filter((n) => n.category === "Event");

  return (
    <>
      <UrgentNoticeModal notice={URGENT_HOME_NOTICE} />
      <HomeHeroPortals />
      <HomeImportantAnnouncements items={news} />
      <HomeAboutSection />
      <HomeDirectorsCorner />
      <HomeAcademicUnits />
      <HomeNewsEventsGrid news={news} events={events} />
      <HomeStatsStrip />
      <HomeGalleryPreview />
    </>
  );
}
