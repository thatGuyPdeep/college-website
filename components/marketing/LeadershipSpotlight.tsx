import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEADERSHIP_SPOTLIGHT } from "@/lib/content/reference-portal";

export function LeadershipSpotlight() {
  return (
    <section className="section bg-white" aria-labelledby="leadership-heading">
      <div className="container-site">
        <h2 id="leadership-heading" className="sr-only">Leadership</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {LEADERSHIP_SPOTLIGHT.map((person) => (
            <article
              key={person.name}
              className="flex flex-col sm:flex-row gap-5 p-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-[#F0F4FF] to-white card-lift"
            >
              <div className="relative w-28 h-32 sm:w-32 sm:h-36 shrink-0 rounded-xl overflow-hidden border-2 border-[#F5C200]/50">
                <Image src={person.image} alt={person.name} fill className="object-cover" sizes="128px" />
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-xs font-bold text-[#C8201A] uppercase tracking-wide">{person.role}</p>
                <h3 className="text-xl font-bold text-[#0D2660] mt-1">{person.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{person.org}</p>
                <div className="flex flex-wrap gap-2 mt-4 mt-auto pt-4">
                  <Button asChild size="sm" variant="outline" className="border-[#0D2660] text-[#0D2660]">
                    <Link href={person.profileHref}>Profile</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-[#0D2660] hover:bg-[#071540]">
                    <Link href={person.messageHref}>
                      Message <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
