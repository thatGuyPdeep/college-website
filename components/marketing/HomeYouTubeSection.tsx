import Link from "next/link";
import { Play } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { YouTubeVideoGrid } from "@/components/gallery/YouTubeVideoGrid";
import { getPublicGalleryContent } from "@/lib/content/gallery";
import { YOUTUBE_CHANNEL } from "@/lib/utils/constants";

export async function HomeYouTubeSection() {
  const { videos } = await getPublicGalleryContent();
  const videoIds = videos.slice(0, 4).map((v) => v.id);
  if (videoIds.length === 0) return null;

  return (
    <section className="section bg-[#F0F4FF]" aria-labelledby="home-videos-heading" id="videos">
      <div className="container-site">
        <SectionHeader
          eyebrow="Media"
          title="Videos from the Mission"
          description="Campus life, conventions, and seva activities in Narayanpur"
          className="mb-8"
        />
        <YouTubeVideoGrid videoIds={videoIds} />
        <p className="text-center mt-6">
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C8201A] hover:underline"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            View all on YouTube
          </a>
          {" · "}
          <Link href="/gallery#videos" className="text-sm font-semibold text-[#0D2660] hover:underline">
            Full gallery →
          </Link>
        </p>
      </div>
    </section>
  );
}
