import { getPublicNews } from "@/lib/content/public-data";
import { UrgentNoticeModal } from "@/components/marketing/UrgentNoticeModal";
import { HomeHeroSlider } from "@/components/marketing/HomeHeroSlider";
import { HomeHeroPortals } from "@/components/marketing/HomeHeroPortals";
import { AdmissionsStatsStrip } from "@/components/marketing/AdmissionsStatsStrip";
import { HomeImportantAnnouncements } from "@/components/marketing/HomeImportantAnnouncements";
import { HomeAboutSection } from "@/components/marketing/HomeAboutSection";
import { HomeAcademicUnits } from "@/components/marketing/HomeAcademicUnits";
import { HomeNewsEventsGrid } from "@/components/marketing/HomeNewsEventsGrid";
import { HomeStatsStrip } from "@/components/marketing/HomeStatsStrip";
import { HomeGalleryPreview } from "@/components/marketing/HomeGalleryPreview";
import { ImportantLinksGrid } from "@/components/marketing/ImportantLinksGrid";
import { HomeYouTubeSection } from "@/components/marketing/HomeYouTubeSection";
import { HomeSocialStrip } from "@/components/marketing/HomeSocialStrip";
import { URGENT_HOME_NOTICE } from "@/lib/content/reference-portal";

/** IIT Delhi visual layout — hero slider, portal dock, announcements, about, units, news */
export default async function Home() {
  const news = await getPublicNews(16);
  const events = news.filter((n) => n.category === "Event");

  return (
    <>
      <UrgentNoticeModal notice={URGENT_HOME_NOTICE} />
      <HomeHeroSlider />
      <HomeHeroPortals />
      <AdmissionsStatsStrip />
      <HomeImportantAnnouncements items={news} />
      <HomeAboutSection />
      <HomeAcademicUnits />
      <HomeNewsEventsGrid news={news} events={events} />
      <HomeStatsStrip />
      <HomeGalleryPreview />
      <HomeYouTubeSection />
      <ImportantLinksGrid />
      <HomeSocialStrip />
    </>
  );
}
