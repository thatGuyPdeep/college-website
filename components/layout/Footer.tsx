import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, AtSign, MessageCircle, Play } from "lucide-react";
import { RKM_LOGO_URL, SITE_FULL_NAME, SOCIAL_LINKS, EXTERNAL_LINKS } from "@/lib/utils/constants";

const FOOTER_LINKS = {
  "Quick Links": [
    { label: "About the Mission", href: "/about" },
    { label: "Vision & Mission", href: "/vision-mission" },
    { label: "UG Programmes", href: "/academics" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Events", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  Admissions: [
    { label: "Apply Online", href: "/admissions/apply" },
    { label: "Track Application", href: "/admissions/dashboard" },
    { label: "Faculty Vacancies", href: "/careers" },
    { label: "ITI Programme", href: "/academics/iti" },
    { label: "Mandatory Disclosure", href: "/disclosure" },
  ],
  Resources: [
    { label: "Support the Mission", href: "/donate" },
    { label: "UGC Mandatory Disclosure", href: "/disclosure" },
    { label: "Grievance Redressal", href: "/contact#grievance" },
    { label: "Anti-Ragging Cell", href: "/contact#grievance" },
    { label: "Ramakrishna Mission ITI", href: EXTERNAL_LINKS.iti },
    { label: "Online Reading (Library)", href: EXTERNAL_LINKS.onlineReading },
    { label: "Belur Math (HQ)", href: EXTERNAL_LINKS.belurMath },
  ],
};

const SOCIALS = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, icon: Globe },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, icon: AtSign },
  { label: "Twitter / X", href: SOCIAL_LINKS.twitter, icon: MessageCircle },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, icon: Play },
];

function FooterLinkGroup({ group, links }: { group: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[#F5C200] font-semibold text-sm uppercase tracking-wide border-b border-blue-800 pb-2 mb-4">
        {group}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${group}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-gray-400 hover:text-[#F5C200] transition-colors inline-block py-1 min-h-9 leading-9 sm:min-h-0 sm:leading-normal sm:py-0"
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#071540] text-gray-300 shrink-0">
      <div className="gold-gradient h-1" aria-hidden="true" />

      <div className="bg-[#0D2660] py-4 sm:py-5 text-center border-b border-blue-900 px-4">
        <p className="devanagari text-base sm:text-lg font-semibold text-[#F5C200] tracking-wide leading-snug">
          आत्मनो मोक्षार्थं जगद्धिताय च
        </p>
        <p className="text-xs sm:text-sm text-blue-300 mt-1 italic max-w-xl mx-auto leading-relaxed">
          For one&apos;s own salvation and for the welfare of the world — Swami Vivekananda
        </p>
      </div>

      <div className="container-site py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
                <Image
                  src={RKM_LOGO_URL}
                  alt="Ramakrishna Mission Emblem"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform drop-shadow-lg"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-base leading-tight">{SITE_FULL_NAME}</div>
                <div className="text-sm text-[#F5C200]">Narayanpur, Chhattisgarh</div>
                <div className="text-xs text-blue-400/70 mt-0.5">A Branch Centre of Belur Math</div>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Serving the Abujhmaria tribal community through education, healthcare, and rural
              development since 1985 — 2,730+ students receiving free education across 200+ villages.
            </p>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-[#F5C200] shrink-0" aria-hidden="true" />
                <span>Ramakrishna Mission Ashrama, Narayanpur, Dist. Narayanpur, Chhattisgarh – 494 661</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#F5C200] shrink-0" aria-hidden="true" />
                <a href="tel:+917781252251" className="hover:text-white transition-colors">07781-252251</a>
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="h-4 w-4 text-[#F5C200] shrink-0" aria-hidden="true" />
                <a href="mailto:rkm.narainpur@gmail.com" className="hover:text-white transition-colors break-all">
                  rkm.narainpur@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <Globe className="h-4 w-4 text-[#F5C200] shrink-0" aria-hidden="true" />
                <a href={EXTERNAL_LINKS.missionSite} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors break-all">
                  narainpur.rkmm.org
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="tap-target p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-[#F5C200] hover:border-[#F5C200]/40 transition-colors"
                >
                  <s.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <FooterLinkGroup key={group} group={group} links={links} />
            ))}
          </div>
        </div>

        <div className="border-t border-blue-900 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {SITE_FULL_NAME}, Narayanpur. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/disclosure" className="hover:text-[#F5C200] transition-colors py-1">Mandatory Disclosure</Link>
            <Link href="/privacy" className="hover:text-[#F5C200] transition-colors py-1">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#F5C200] transition-colors py-1">Terms</Link>
            <Link href="/refund" className="hover:text-[#F5C200] transition-colors py-1">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
