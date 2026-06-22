import type { Metadata } from "next";
import Link from "next/link";
import { Target, Compass, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { RKM_FACTS } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Vision & Mission",
  description:
    "The vision, mission and guiding ideology of Ramakrishna Mission Ashrama, Narayanpur — rooted in the teachings of Sri Ramakrishna and Swami Vivekananda.",
};

const IDEOLOGY = [
  { n: "1", title: "God-realization is the goal of life", body: "Realization of the Ultimate Reality (Brahman) alone gives everlasting fulfilment and peace." },
  { n: "2", title: "Potential divinity of the soul", body: "Every being is potentially divine; true religion is the manifestation of this inner divinity." },
  { n: "3", title: "Synthesis of the Yogas", body: "Jnana, Bhakti, Raja and Karma Yoga combined build a balanced, fully-functioning personality." },
  { n: "4", title: "Morality based on strength", body: "Knowledge of the Atman overcomes fear and weakness — the foundation of man-making education." },
  { n: "5", title: "Harmony of religions", body: "\"As many faiths, so many paths\" — all sincere paths lead to the one Ultimate Truth." },
  { n: "6", title: "Avatarhood of Sri Ramakrishna", body: "Reverence is shown to all Avataras and the founders of all religions in every institution of the Order." },
  { n: "7", title: "A new philosophy of work", body: "All work is sacred; work done as worship and service to man is service to God (Shiva Jnane Jiva Seva)." },
];

const YOGAS = [
  { name: "Karma Yoga", meaning: "Yoga of selfless work", symbol: "Wavy waters" },
  { name: "Bhakti Yoga", meaning: "Yoga of devotion", symbol: "Lotus" },
  { name: "Jnana Yoga", meaning: "Yoga of knowledge", symbol: "Rising sun" },
  { name: "Raja Yoga", meaning: "Yoga of meditation", symbol: "Serpent" },
];

export default function VisionMissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Ideals"
        title="Vision & Mission"
        description={RKM_FACTS.motto_english}
      >
        <p className="devanagari text-lg sm:text-xl text-[#F5C200] font-semibold mt-4">
          {RKM_FACTS.motto_sanskrit}
        </p>
        <p className="text-blue-300 text-sm italic mt-1">— Swami Vivekananda</p>
      </PageHero>

      <section className="section bg-white">
        <div className="container-site grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-[#F0F4FF] rounded-2xl p-8 border border-blue-100">
            <div className="p-3 rounded-xl bg-[#0D2660] w-fit mb-5">
              <Compass className="h-6 w-6 text-[#F5C200]" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-[#0D2660] mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To awaken the divinity inherent in every individual and to build, through man-making and
              character-building education, a generation of self-reliant, compassionate citizens who
              uplift the Abujhmaria tribal community and society at large.
            </p>
          </div>
          <div className="bg-[#F0F4FF] rounded-2xl p-8 border border-blue-100">
            <div className="p-3 rounded-xl bg-[#C8201A] w-fit mb-5">
              <Target className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-[#0D2660] mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To serve God in humanity through education, healthcare, vocational training and rural
              development — carrying the message of Sri Ramakrishna and Swami Vivekananda to the
              remotest villages of Abujhmarh, without distinction of caste, creed or religion.
            </p>
          </div>
        </div>
      </section>

      {/* Ideology */}
      <section id="ideology" className="py-16 px-4 bg-[#F0F4FF] scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D2660] text-center mb-3">Our Guiding Ideology</h2>
          <p className="text-gray-500 text-center max-w-3xl mx-auto mb-12">
            The ideology of Ramakrishna Math &amp; Mission consists of the eternal principles of Vedanta —
            <strong> modern, universal and practical</strong> — as lived by Sri Ramakrishna and expounded by Swami Vivekananda.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {IDEOLOGY.map((p) => (
              <div key={p.n} className="bg-white rounded-xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-full bg-[#0D2660] text-[#F5C200] font-bold flex items-center justify-center mb-4">
                  {p.n}
                </div>
                <h3 className="font-bold text-[#0D2660] mb-2 leading-snug">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Emblem / Yogas */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D2660] text-center mb-3">The Synthesis of Yogas</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
            Expressed in the emblem designed by Swami Vivekananda — a balanced personality unites all four paths.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {YOGAS.map((y) => (
              <div key={y.name} className="navy-gradient text-white rounded-xl p-6 text-center">
                <div className="text-[#F5C200] font-bold mb-1">{y.name}</div>
                <p className="text-sm text-blue-200 mb-3">{y.meaning}</p>
                <p className="text-xs text-blue-300/80 border-t border-white/10 pt-3">Emblem: {y.symbol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="navy-gradient text-white py-14 px-4 text-center relative">
        <div className="gold-gradient h-1 absolute top-0 left-0 right-0" aria-hidden="true" />
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Learn More About the Mission</h2>
          <p className="text-blue-200 mb-7">
            Discover the history, activities and impact of Ramakrishna Mission Ashrama, Narayanpur.
          </p>
          <Button asChild size="lg" className="bg-[#C8201A] hover:bg-[#9B1812] text-white font-bold">
            <Link href="/about">About the Mission <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="gold-gradient h-1 absolute bottom-0 left-0 right-0" aria-hidden="true" />
      </section>
    </>
  );
}
