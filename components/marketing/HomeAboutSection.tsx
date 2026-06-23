import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HOME_ABOUT } from "@/lib/content/design-portal";

/** IIT Delhi — About block with read more */
export function HomeAboutSection() {
  return (
    <section className="home-section bg-white">
      <div className="container-site">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2660] mb-4">{HOME_ABOUT.title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{HOME_ABOUT.excerpt}</p>
            <div className="flex flex-wrap gap-4 mt-5">
              <Link
                href={HOME_ABOUT.readMoreHref}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#C8201A] hover:text-[#9B1812]"
              >
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={HOME_ABOUT.newsletterHref}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#0D2660] hover:underline"
              >
                News feed (RSS)
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
            <Image
              src="/images/ashrama-2.jpg"
              alt="Ramakrishna Mission College campus, Narayanpur"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
