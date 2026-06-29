import { SOCIAL_LINKS, YOUTUBE_CHANNEL } from "@/lib/utils/constants";
import { HOME_WELCOME_VIDEO_ID } from "@/lib/content/portal-hubs";

/** Embedded social / video feed block for homepage (IIT-style media strip) */
export function HomeSocialEmbeds() {
  const embedId = HOME_WELCOME_VIDEO_ID;

  return (
    <section className="section bg-white border-t border-blue-100" aria-labelledby="social-feed-heading">
      <div className="container-site">
        <h2 id="social-feed-heading" className="text-xl font-bold text-[#0D2660] mb-2">
          Latest from the Mission
        </h2>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          Follow Ramakrishna Mission Narayanpur on social media for campus news, seva activities, and student achievements.
        </p>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Featured Video</h3>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg ring-1 ring-gray-200 bg-black">
              <iframe
                title="Ramakrishna Mission Narayanpur — featured video"
                src={`https://www.youtube-nocookie.com/embed/${embedId}?rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm font-semibold text-[#C8201A] hover:underline"
            >
              Subscribe on YouTube →
            </a>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Connect With Us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-blue-100 hover:bg-blue-50 text-[#0D2660] font-medium">
                  Facebook — Mission Narayanpur updates →
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-blue-100 hover:bg-blue-50 text-[#0D2660] font-medium">
                  Instagram — photos & events →
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-blue-100 hover:bg-blue-50 text-[#0D2660] font-medium">
                  Twitter / X — announcements →
                </a>
              </li>
              <li>
                <a href="/news" className="flex items-center gap-2 p-3 rounded-lg border border-blue-100 hover:bg-blue-50 text-[#0D2660] font-medium">
                  College noticeboard & news →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
