import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, BookOpen, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  STATS,
  ACCREDITATION_ITEMS,
  RKM_LOGO_URL,
  VIVEKANANDA_QUOTES,
  PROGRAMS,
  INSPIRATION,
} from "@/lib/utils/constants";
import {
  ABUJHMARH,
  ARATI_TIMINGS,
  OPENING_HOURS,
  ASHRAMA_ACTIVITIES,
  SERVICE_TAGLINE,
} from "@/lib/content/site-info";
import { getPublicNews } from "@/lib/content/public-data";

export default async function Home() {
  const news = await getPublicNews(6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden navy-gradient text-white">
        <Image
          src="/images/ashrama-4.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-20 mix-blend-luminosity"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#0D2660] via-[#0D2660]/90 to-[#0D2660]/50" aria-hidden="true" />
        <div className="absolute inset-0 wave-pattern opacity-40" aria-hidden="true" />
        <div className="gold-gradient h-1 w-full relative z-10" aria-hidden="true" />

        <div className="relative container-site py-12 sm:py-16 md:py-20 lg:py-28">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="order-2 md:order-1">
              <Badge className="mb-4 sm:mb-5 bg-white/10 text-[#F5C200] border-[#F5C200]/40 backdrop-blur text-xs sm:text-sm px-3 py-1 font-semibold">
                Admissions Open 2026–27
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-3 text-balance">
                Ramakrishna Mission College
              </h1>
              <p className="text-base sm:text-lg text-[#F5C200] font-semibold mb-1">Narayanpur, Chhattisgarh</p>
              <p className="text-xs sm:text-sm text-blue-300 mb-5 sm:mb-6">A Branch Centre of Belur Math</p>

              <p className="text-blue-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl leading-relaxed">
                Inspired by Swami Vivekananda&apos;s vision of{" "}
                <strong className="text-white">man-making education</strong>, we serve
                the Abujhmaria tribal community through transformative education,
                healthcare, and holistic development since 1985.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
                <Button asChild size="lg" className="w-full sm:w-auto bg-[#C8201A] hover:bg-[#9B1812] text-white font-bold shadow-lg min-h-12">
                  <Link href="/admissions/apply">
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-[#F5C200]/60 text-[#F5C200] hover:bg-[#F5C200]/10 min-h-12">
                  <Link href="/about">Our Mission</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:hidden">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4 text-center border border-white/10">
                    <div className="text-lg sm:text-xl font-bold text-[#F5C200]">{s.value}</div>
                    <div className="text-[10px] sm:text-xs text-blue-300 mt-0.5 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2 flex flex-col items-center gap-6 sm:gap-8">
              <div className="relative flex items-center justify-center">
                <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 drop-shadow-2xl">
                  <Image
                    src={RKM_LOGO_URL}
                    alt="Ramakrishna Mission Official Logo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 224px, 256px"
                    priority
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-[#F5C200]/5 scale-110 pointer-events-none blur-xl" aria-hidden="true" />
              </div>

              <div className="hidden md:grid grid-cols-2 gap-3 w-full max-w-sm">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                    <div className="text-xl lg:text-2xl font-bold text-[#F5C200]">{s.value}</div>
                    <div className="text-xs text-blue-300 mt-0.5 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="gold-gradient h-1 w-full relative z-10" aria-hidden="true" />
      </section>

      {/* Accreditations */}
      <section className="bg-white border-b border-blue-100 py-4 sm:py-5" aria-label="Accreditations">
        <div className="container-site">
          <p className="text-xs sm:text-sm font-bold text-[#0D2660] uppercase tracking-wide mb-3 sm:mb-0 sm:hidden">
            Affiliated &amp; recognised by
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
            <span className="hidden sm:block text-sm font-bold text-[#0D2660] uppercase tracking-wide shrink-0">
              Affiliated &amp; recognised by
            </span>
            <div className="scroll-strip sm:flex-wrap sm:overflow-visible">
              {ACCREDITATION_ITEMS.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 sm:px-4 py-1.5 shadow-sm"
                  title={a.description}
                >
                  <Award className="h-3.5 w-3.5 text-[#0D2660] shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold text-[#0D2660] whitespace-nowrap">{a.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-full px-3 sm:px-4 py-1.5 shadow-sm">
                <Star className="h-3.5 w-3.5 text-[#D4A800] shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-[#0D2660] whitespace-nowrap">Indira Gandhi Award 2009</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Abujhmarh */}
      <section className="section bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <SectionHeader
              eyebrow="The Region We Serve"
              title={ABUJHMARH.title}
              className="mb-5"
            />
            {ABUJHMARH.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="text-gray-600 leading-relaxed mb-4">{p}</p>
            ))}
            <Link href="/about/history" className="text-[#0D2660] font-semibold hover:underline inline-flex items-center gap-1">
              Read our history <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-blue-100">
            <Image src="/images/ashrama-2.jpg" alt="Abujhmarh region served by the Mission" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Seva Activities — all 8 */}
      <section className="section section-alt">
        <div className="container-site">
          <SectionHeader
            align="center"
            eyebrow="Service to Man is Service to God"
            title="Our Seva Activities"
            description={SERVICE_TAGLINE}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ASHRAMA_ACTIVITIES.map((a) => (
              <Link
                key={a.slug}
                href={a.href}
                className="group bg-white border border-blue-100 rounded-2xl overflow-hidden card-lift block"
              >
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <Image
                    src={a.img}
                    alt={a.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D2660]/80 via-[#0D2660]/20 to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-white text-sm sm:text-base">{a.title}</h3>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
              <Link href="/about/activities">All Service Activities <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Inspiration */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeader
            align="center"
            title="Our Inspiration"
            description="The Ashrama draws its ideals from the lives and teachings of the Holy Trinity."
            className="mb-10"
          />
          <div className="grid sm:grid-cols-3 gap-8">
            {INSPIRATION.map((p) => (
              <Link
                key={p.slug}
                href={`/about/inspiration/${p.slug}`}
                className="group flex flex-col items-center text-center card-lift rounded-2xl p-6 border border-transparent hover:border-blue-100"
              >
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[#F5C200]/60 shadow-md mb-4 group-hover:border-[#C8201A]/60 transition-colors">
                  <Image src={p.img} alt={p.name} fill className="object-cover" sizes="160px" />
                </div>
                <h3 className="font-bold text-[#0D2660] text-lg group-hover:text-[#C8201A] transition-colors">{p.name}</h3>
                <p className="text-sm text-[#C8201A] font-medium">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="section section-alt">
        <div className="container-site">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <SectionHeader
              eyebrow="Man-Making Education"
              title="Featured Programmes"
              description="Industry-aligned, value-based education for holistic development"
              className="mb-0"
            />
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto border-[#0D2660] text-[#0D2660] hover:bg-[#0D2660] hover:text-white transition-colors shrink-0 min-h-11"
            >
              <Link href="/academics">All Programmes <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {PROGRAMS.map((p) => (
              <Link key={p.slug} href={`/academics/courses/${p.slug}`} className="group block h-full">
                <Card className="h-full card-lift border-blue-100 hover:border-[#0D2660]/30">
                  <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="p-2.5 rounded-lg bg-blue-50 group-hover:bg-[#0D2660] transition-colors shrink-0">
                        <BookOpen className="h-5 w-5 text-[#0D2660] group-hover:text-white transition-colors" aria-hidden="true" />
                      </div>
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-[#0D2660] border-0 font-semibold uppercase shrink-0">
                        {p.level}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#0D2660] transition-colors text-base leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex-1 leading-relaxed">{p.short}</p>
                    <div className="mt-4 text-sm text-[#C8201A] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote — featured from source home page */}
      <section className="navy-gradient py-12 sm:py-16 px-[clamp(1rem,4vw,2rem)] text-white relative overflow-hidden">
        <div className="gold-gradient h-1 absolute top-0 left-0 right-0" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto text-center px-2">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 drop-shadow-xl">
            <Image src={RKM_LOGO_URL} alt="" fill className="object-contain" sizes="80px" aria-hidden="true" />
          </div>
          <blockquote>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed mb-5 sm:mb-6 text-blue-100 text-balance">
              &ldquo;{VIVEKANANDA_QUOTES[1].quote}&rdquo;
            </p>
            <footer className="text-[#F5C200] text-sm sm:text-base font-semibold">
              — {VIVEKANANDA_QUOTES[1].attribution}
            </footer>
          </blockquote>
        </div>
        <div className="gold-gradient h-1 absolute bottom-0 left-0 right-0" aria-hidden="true" />
      </section>

      {/* News */}
      <section className="section section-alt">
        <div className="container-site">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0D2660]">Latest News &amp; Events</h2>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto border-[#0D2660] text-[#0D2660] hover:bg-[#0D2660] hover:text-white transition-colors shrink-0 min-h-11"
            >
              <Link href="/news">All News <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {news.slice(0, 6).map((n) => (
              <Link key={n.slug} href={`/news/${n.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden card-lift border-blue-100 bg-white pt-0 gap-0">
                  <div className="relative h-48 sm:h-44 overflow-hidden">
                    <Image
                      src={n.img}
                      alt={n.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-5 sm:p-6">
                    <Badge variant="outline" className="mb-3 text-xs border-[#0D2660] text-[#0D2660] bg-blue-50">
                      {n.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#0D2660] mb-2 transition-colors leading-snug text-base">
                      {n.title}
                    </h3>
                    <p className="text-xs text-gray-400">{n.date}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Visit info — arati & opening hours */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeader
            align="center"
            eyebrow="Plan Your Visit"
            title="Temple Arati & Opening Hours"
            className="mb-8"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#F0F4FF] rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-[#C8201A]" />
                <h3 className="font-bold text-[#0D2660]">Arati Timings</h3>
              </div>
              <div className="table-responsive border-0 shadow-none">
                <table className="w-full text-sm">
                  <tbody>
                    {ARATI_TIMINGS.map((row) => (
                      <tr key={row.period} className="border-b border-blue-100 last:border-0">
                        <td className="py-2 text-gray-600 pr-3">{row.period}</td>
                        <td className="py-2 text-[#0D2660] font-semibold whitespace-nowrap">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-[#F0F4FF] rounded-2xl p-6 border border-blue-100 space-y-5">
              <div>
                <h3 className="font-bold text-[#0D2660] mb-2">Office</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {OPENING_HOURS.office.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#0D2660] mb-2">Hospital</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {OPENING_HOURS.hospital.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#0D2660] mb-2">Temple</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {OPENING_HOURS.temple.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            </div>
            <div className="bg-[#F0F4FF] rounded-2xl p-6 border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-[#C8201A]" />
                  <h3 className="font-bold text-[#0D2660]">Contact</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Ramakrishna Mission Ashrama, Sonpur Road, PO &amp; Dist. Narayanpur, Chhattisgarh – 494661
                </p>
                <p className="text-sm text-gray-600">rkm.narainpur@gmail.com · 07781-252251</p>
              </div>
              <Button asChild className="mt-6 bg-[#0D2660] hover:bg-[#071540] w-full">
                <Link href="/contact">Full Contact Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why RKM */}
      <section className="section section-alt">
        <div className="container-site">
          <SectionHeader align="center" title="Why RKM College?" className="mb-8 sm:mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: BookOpen, title: "Value-Based Education", desc: "Character-building curriculum aligned with Swami Vivekananda's vision of man-making education." },
              { icon: Award, title: "National Recognition", desc: "The Mission is a recipient of the Indira Gandhi National Integration Award (2009) and the Dr. Ambedkar National Award." },
              { icon: MapPin, title: "Tribal Empowerment", desc: "Dedicated to upliftment of Abujhmaria PVTG tribals — free food, stay & education." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-5 sm:p-7 border border-blue-100 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 sm:gap-5 card-lift">
                <div className="p-3 rounded-xl bg-[#0D2660] w-fit h-fit shrink-0">
                  <f.icon className="h-6 w-6 text-[#F5C200]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0D2660] mb-2 text-lg">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="navy-gradient text-white py-12 sm:py-16 px-[clamp(1rem,4vw,2rem)] text-center relative">
        <div className="gold-gradient h-1 absolute top-0 left-0 right-0" aria-hidden="true" />
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-balance">Begin Your Journey with Us</h2>
          <p className="text-blue-200 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
            Join the mission of empowering tribal youth through education grounded in Swami Vivekananda&apos;s ideals.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto bg-[#C8201A] hover:bg-[#9B1812] text-white font-bold shadow-lg min-h-12">
              <Link href="/admissions/apply">Apply for Admission</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-[#F5C200]/60 text-[#F5C200] hover:bg-[#F5C200]/10 min-h-12">
              <Link href="/contact">Contact Admissions</Link>
            </Button>
          </div>
        </div>
        <div className="gold-gradient h-1 absolute bottom-0 left-0 right-0" aria-hidden="true" />
      </section>
    </>
  );
}
