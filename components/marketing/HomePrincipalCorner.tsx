import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LEADERSHIP_PROFILES } from "@/lib/content/leadership-profiles";

/** SMKV Vice-Chancellor / Principal corner — paired with Secretary's Corner */
export function HomePrincipalCorner() {
  const leader = LEADERSHIP_PROFILES[1];
  if (!leader) return null;

  return (
    <section className="home-section bg-white border-b border-gray-200">
      <div className="container-site">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0D2660] mb-5 sm:mb-6">Principal&apos;s Corner</h2>
        <article className="grid md:grid-cols-5 gap-6 bg-[#F0F4FF] border border-blue-100 rounded-lg overflow-hidden">
          <div className="relative md:col-span-2 aspect-[4/3] md:aspect-auto md:min-h-[220px]">
            <Image
              src={leader.image}
              alt={leader.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div className="md:col-span-3 p-5 sm:p-6 flex flex-col justify-center">
            <p className="text-xs font-bold text-[#C8201A] uppercase tracking-wide">{leader.title}</p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D2660] mt-1">{leader.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{leader.org}</p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4 line-clamp-4">{leader.message}</p>
            <Link
              href={`/about/leadership/${leader.slug}`}
              className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-[#0D2660] hover:text-[#C8201A]"
            >
              Read more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
