import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { RKM_LOGO_URL, RKM_FACTS, MILESTONES, AWARDS, INSPIRATION, ASHRAMA_GALLERY } from "@/lib/utils/constants";
import { getPublicLeadership } from "@/lib/content/site-content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Ramakrishna Mission Ashrama, Narayanpur — its history, mission, and service to the Abujhmaria tribal community since 1985.",
};

const VALUES = [
  { title: "Man-Making Education", body: "Swami Vivekananda envisioned education that builds character, strength, and inner divinity — not mere information transfer. Every curriculum and activity at RKM Narayanpur is guided by this ideal." },
  { title: "Service as Worship",   body: "\"He who sees Shiva in the poor, in the weak, and in the diseased, really worships Shiva.\" All activities — teaching, healing — are performed as Seva, seeing the Divine in every human being." },
  { title: "Harmony of Faiths",    body: "The Mission, true to Sri Ramakrishna's teaching, respects and serves people of all faiths and communities without distinction of caste, creed, or race." },
  { title: "Holistic Development", body: "We nurture physical, mental, moral, and spiritual growth — through sports, cultural activities, vocational training, and value-based academic programmes." },
];

export default async function AboutPage() {
  const leadership = await getPublicLeadership();
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About the Mission"
        description="A spiritual and philanthropic centre rooted in the teachings of Sri Ramakrishna and Swami Vivekananda, dedicated to the upliftment of the Abujhmaria tribal community since 1985."
      />

      <section className="section bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <h2 className="text-3xl font-bold text-[#0D2660] mb-5">Ramakrishna Mission Ashrama, Narayanpur</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Ramakrishna Mission Ashrama Narayanpur (RKMN) is a branch centre of <strong>Ramakrishna Math and Ramakrishna Mission</strong>,
              headquartered at Belur Math, West Bengal. Established on <strong>2 August 1985</strong>,
              the Ashrama was set up to serve the tribals of the remote Abujhmarh jungle in Narayanpur district, Chhattisgarh.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The Abujhmarh region — meaning &ldquo;unknown highlands&rdquo; — spans about 4,000 sq. km. and is home to
              roughly 34,000 Abujhmaria tribals across 230+ far-flung villages. These tribals, categorised as a{" "}
              <strong>Particularly Vulnerable Tribal Group (PVTG)</strong> by the Government of India, had near-zero
              literacy and limited access to healthcare before the Mission arrived.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Today, RKMN serves <strong>200+ villages</strong> through education, healthcare, agricultural training,
              and rural development — uplifting thousands of lives each year in true Vivekananda spirit.{" "}
              <Link href="/about/history" className="text-[#0D2660] font-semibold hover:underline">Read our full history →</Link>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F0F4FF] rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-[#C8201A]" />
                  <span className="text-xs font-bold text-[#0D2660] uppercase">Founded</span>
                </div>
                <p className="text-gray-800 font-medium text-sm">{RKM_FACTS.founded}</p>
              </div>
              <div className="bg-[#F0F4FF] rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-[#C8201A]" />
                  <span className="text-xs font-bold text-[#0D2660] uppercase">Affiliation</span>
                </div>
                <p className="text-gray-800 font-medium text-sm">Belur Math, West Bengal</p>
              </div>
              <div className="bg-[#F0F4FF] rounded-xl p-4 border border-blue-100 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-[#C8201A]" />
                  <span className="text-xs font-bold text-[#0D2660] uppercase">National Recognition</span>
                </div>
                <p className="text-gray-800 font-medium text-sm">{RKM_FACTS.award}</p>
              </div>
            </div>
          </div>

          {/* Logo + Emblem explanation */}
          <div className="flex flex-col items-center gap-8">
            <div className="bg-[#F0F4FF] rounded-2xl p-10 flex flex-col items-center gap-6 border border-blue-100 shadow-sm w-full">
              {/* Logo — transparent bg on cream card */}
              <div className="relative w-44 h-44 drop-shadow-xl">
                <Image
                  src={RKM_LOGO_URL}
                  alt="Official Ramakrishna Mission Emblem"
                  fill
                  className="object-contain"
                  sizes="176px"
                />
              </div>
              <div className="text-center">
                <p className="devanagari text-xl text-[#C8201A] font-bold">{RKM_FACTS.motto_sanskrit}</p>
                <p className="text-sm text-gray-500 italic mt-1">{RKM_FACTS.motto_english}</p>
                <p className="text-xs text-gray-400 mt-0.5">— Swami Vivekananda</p>
              </div>
            </div>

            <div className="navy-gradient text-white rounded-2xl p-7 w-full">
              <p className="text-[#F5C200] text-sm font-bold uppercase tracking-wide mb-3">The Emblem Explained</p>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><span className="text-white font-semibold">Wavy waters</span> — Karma Yoga (selfless action)</li>
                <li><span className="text-white font-semibold">Lotus</span> — Bhakti Yoga (devotion)</li>
                <li><span className="text-white font-semibold">Rising sun</span> — Jnana Yoga (knowledge)</li>
                <li><span className="text-white font-semibold">Serpent</span> — Raja Yoga (meditation)</li>
                <li><span className="text-white font-semibold">Swan (Hamsa)</span> — Paramatman (Supreme Self)</li>
              </ul>
              <p className="text-xs text-blue-400 mt-3 italic">Designed by Swami Vivekananda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Inspiration */}
      <section className="py-16 px-4 bg-white border-t border-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D2660] text-center mb-3">Our Inspiration</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
            The Ashrama draws its ideals from the lives and teachings of the Holy Trinity.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {INSPIRATION.map((p) => (
              <Link key={p.name} href={`/about/inspiration/${p.slug}`} className="flex flex-col items-center text-center group card-lift rounded-2xl p-4">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#F5C200]/60 shadow-md mb-4 group-hover:border-[#F5C200] transition-colors">
                  <Image src={p.img} alt={p.name} fill className="object-cover" sizes="160px" />
                </div>
                <h3 className="font-bold text-[#0D2660] text-lg group-hover:underline">{p.name}</h3>
                <p className="text-sm text-[#C8201A] font-medium">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D2660] text-center mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-7 border border-blue-100 hover:shadow-md hover:border-[#0D2660]/30 transition-all">
                <div className="w-8 h-1 bg-[#C8201A] rounded mb-4" aria-hidden="true" />
                <h3 className="font-bold text-[#0D2660] mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership — UGC disclosure anchor */}
      <section id="leadership" className="py-16 px-4 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D2660] text-center mb-3">Leadership &amp; Functionaries</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
            Key office bearers of Ramakrishna Mission Ashrama, Narayanpur and the College.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((person) => (
              <div key={person.name} className="bg-[#F0F4FF] rounded-xl p-6 border border-blue-100">
                <h3 className="font-bold text-[#0D2660] text-lg">{person.name}</h3>
                <p className="text-sm text-[#C8201A] font-medium mb-3">{person.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{person.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container-site max-w-3xl">
          <SectionHeader align="center" title="Journey Through the Years" className="mb-8" />
          <div className="space-y-4 sm:space-y-6">
            {MILESTONES.map((m) => (
              <div key={m.year} className="flex gap-3 sm:gap-4 items-start">
                <div className="shrink-0 w-12 sm:w-14">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0D2660] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-md border-2 border-[#F5C200]">
                    {m.year}
                  </div>
                </div>
                <div className="flex-1 min-w-0 bg-[#F0F4FF] border border-blue-200 rounded-xl p-4 sm:p-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glimpses of the Ashrama */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D2660] text-center mb-3">Glimpses of the Ashrama</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
            A look at the campus, temple and daily life at Ramakrishna Mission Ashrama, Narayanpur.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ASHRAMA_GALLERY.map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-blue-100 group">
                <Image
                  src={src}
                  alt={`Ramakrishna Mission Ashrama, Narayanpur — photo ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 px-4 bg-[#F0F4FF]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D2660] text-center mb-3">Awards &amp; Recognition</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
            Decades of selfless service to the Abujhmaria tribal community, recognised at the national and state level.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {AWARDS.map((a) => (
              <div key={a.name} className="flex gap-4 bg-white rounded-xl p-5 border border-blue-100">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#0D2660] flex items-center justify-center text-[#F5C200] font-bold text-xs border-2 border-[#F5C200]">
                    {a.year}
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-700 leading-snug font-medium">{a.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/about/awards" className="text-[#0D2660] font-semibold text-sm hover:underline">
              View full awards list →
            </Link>
          </div>
        </div>
      </section>

      <section className="navy-gradient text-white py-12 sm:py-14 px-[clamp(1rem,4vw,2rem)] text-center relative">
        <div className="gold-gradient h-1 absolute top-0 left-0 right-0" aria-hidden="true" />
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-balance">Join Our Family</h2>
          <p className="text-blue-200 mb-6 sm:mb-7 leading-relaxed">
            Be part of a mission that transforms lives through education, compassion, and selfless service.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto bg-[#C8201A] hover:bg-[#9B1812] text-white font-bold min-h-12">
            <Link href="/admissions/apply">Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="gold-gradient h-1 absolute bottom-0 left-0 right-0" aria-hidden="true" />
      </section>
    </>
  );
}
