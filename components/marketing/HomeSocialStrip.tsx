import { Globe, AtSign, MessageCircle, Play } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/utils/constants";

const SOCIALS = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, icon: Globe },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, icon: AtSign },
  { label: "Twitter / X", href: SOCIAL_LINKS.twitter, icon: MessageCircle },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, icon: Play },
] as const;

export function HomeSocialStrip() {
  return (
    <section className="border-y border-blue-100 bg-white" aria-label="Follow us on social media">
      <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Follow Us</span>
        <div className="flex flex-wrap justify-center gap-2">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-[#F0F4FF] text-sm font-medium text-[#0D2660] hover:border-[#0D2660]/30 hover:bg-white transition-colors"
            >
              <Icon className="h-4 w-4 text-[#C8201A]" aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
