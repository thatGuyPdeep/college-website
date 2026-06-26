import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, AtSign, MessageCircle, Play } from "lucide-react";
import { FeedbackStrip } from "@/components/layout/FeedbackStrip";
import { FooterUtilityBar } from "@/components/layout/FooterUtilityBar";
import { VisitorCounter } from "@/components/layout/VisitorCounter";
import { RKM_LOGO_URL, SITE_FULL_NAME, SOCIAL_LINKS, EXTERNAL_LINKS } from "@/lib/utils/constants";

const FOOTER_LINKS = {
  "Quick Links": [
    { label: "Examination", href: "/examination" },
    { label: "Students' Corner", href: "/students-corner" },
    { label: "Study Material", href: "/study-material" },
    { label: "NSS", href: "/nss" },
    { label: "Alumni", href: "/alumni" },
    { label: "Statutory Cells", href: "/cells" },
    { label: "NEP 2020", href: "/nep-2020" },
    { label: "Events", href: "/events" },
    { label: "Download Forms", href: "/forms" },
  ],
  Admissions: [
    { label: "Apply Online", href: "/admissions/apply" },
    { label: "Track Application", href: "/admissions/dashboard" },
    { label: "How to Apply", href: "/admissions/how-to-apply" },
    { label: "Fee Structure", href: "/admissions/fees" },
    { label: "Scholarships", href: "/admissions/scholarships" },
  ],
  "Examination & Career": [
    { label: "Examination Portal", href: "/examination" },
    { label: "Results", href: "/examination/results" },
    { label: "Time Tables", href: "/examination/timetables" },
    { label: "Faculty Vacancies", href: "/careers" },
    { label: "Tenders", href: "/tenders" },
  ],
  Resources: [
    { label: "IQAC", href: "/iqac" },
    { label: "Policies", href: "/policies" },
    { label: "Mandatory Disclosure", href: "/disclosure" },
    { label: "RTI", href: "/rti" },
    { label: "Library E-Resources", href: "/campus/library/e-resources" },
    { label: "Anti-Ragging Cell", href: "/cells/anti-ragging" },
    { label: "Grievance (SGRC)", href: "/cells/sgrc" },
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
      <h3 className="text-[#F5C200] font-semibold text-xs uppercase tracking-wide border-b border-blue-800 pb-1 mb-2">
        {group}
      </h3>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={`${group}-${link.label}`}>
            <Link
              href={link.href}
              className="text-xs text-gray-400 hover:text-[#F5C200] transition-colors leading-snug"
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
    <>
      <FeedbackStrip />
      <footer className="bg-[#071540] text-gray-300 shrink-0">
        <div className="gold-gradient h-0.5" aria-hidden="true" />

        <div className="bg-[#0D2660] py-2 text-center border-b border-blue-900 px-3">
          <p className="devanagari text-sm font-semibold text-[#F5C200] tracking-wide leading-snug">
            आत्मनो मोक्षार्थं जगद्धिताय च
          </p>
          <p className="text-[10px] text-blue-300 mt-0.5 italic max-w-xl mx-auto leading-snug">
            For one&apos;s own salvation and for the welfare of the world — Swami Vivekananda
          </p>
        </div>

        <div className="container-site-compact py-5 sm:py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-3 group">
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src={RKM_LOGO_URL}
                    alt="Ramakrishna Mission Emblem"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm leading-tight">{SITE_FULL_NAME}</div>
                  <div className="text-xs text-[#F5C200]">Narayanpur, Chhattisgarh</div>
                </div>
              </Link>

              <p className="text-xs leading-relaxed text-gray-400 mb-3">
                Serving the Abujhmaria tribal community through education, healthcare, and rural
                development since 1985.
              </p>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 text-[#F5C200] shrink-0" aria-hidden="true" />
                  <span>Narayanpur, Dist. Narayanpur, Chhattisgarh – 494 661</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#F5C200] shrink-0" aria-hidden="true" />
                  <a href="tel:+917781252251" className="hover:text-white transition-colors">07781-252251</a>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-[#F5C200] shrink-0" aria-hidden="true" />
                  <a href="mailto:rkm.narainpur@gmail.com" className="hover:text-white transition-colors break-all">
                    rkm.narainpur@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Globe className="h-3.5 w-3.5 text-[#F5C200] shrink-0" aria-hidden="true" />
                  <a href={EXTERNAL_LINKS.missionSite} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    narainpur.rkmm.org
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-[#F5C200] hover:border-[#F5C200]/40 transition-all micro-lift micro-press hover:scale-110"
                  >
                    <s.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-3">
              {Object.entries(FOOTER_LINKS).map(([group, links]) => (
                <FooterLinkGroup key={group} group={group} links={links} />
              ))}
            </div>
          </div>

          <FooterUtilityBar />

          <div className="iitd-footer-bottom -mx-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.75rem,2vw,1.25rem)] py-2.5 mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-center sm:text-left">
              <div>
                <p>© {new Date().getFullYear()} {SITE_FULL_NAME}, Narayanpur. All rights reserved.</p>
                <p className="mt-0.5 opacity-70">
                  <VisitorCounter />
                </p>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
                <Link href="/disclosure" className="hover:text-[#F5C200] transition-colors">Mandatory Disclosure</Link>
                <Link href="/rti" className="hover:text-[#F5C200] transition-colors">RTI</Link>
                <Link href="/privacy" className="hover:text-[#F5C200] transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-[#F5C200] transition-colors">Terms</Link>
                <Link href="/refund" className="hover:text-[#F5C200] transition-colors">Refund</Link>
                <Link href="/tenders" className="hover:text-[#F5C200] transition-colors">Tenders</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
