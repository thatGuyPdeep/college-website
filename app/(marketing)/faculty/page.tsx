import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { getPublicFaculty } from "@/lib/content/public-data";

export const metadata: Metadata = { title: "Faculty Directory" };

export default async function FacultyPage() {
  const faculty = await getPublicFaculty();

  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Faculty Directory"
        description="Faculty members with qualifications and specializations — as required under UGC mandatory disclosure."
      />
      <section className="section bg-white">
        <div className="container-site max-w-7xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <ol className="flex gap-2">
              <li><Link href="/" className="hover:text-[#0D2660]">Home</Link></li>
              <li>/</li>
              <li aria-current="page">Faculty</li>
            </ol>
          </nav>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((f) => (
              <Link key={f.id} href={`/faculty/${f.id}`} className="block bg-white border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  {f.photo_url ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                      <Image src={f.photo_url} alt={f.name} fill className="object-cover" sizes="56px" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0D2660] to-[#C8201A] flex items-center justify-center text-white font-bold text-lg shrink-0" aria-hidden="true">
                      {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-gray-900 leading-tight">{f.name}</h2>
                    <p className="text-sm text-[#0D2660]">{f.designation}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.dept}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                    {f.qual}
                  </div>
                  <div className="text-xs text-gray-500">
                    Specialization: <span className="text-gray-700">{f.specialization}</span>
                  </div>
                  {f.exp > 0 && (
                    <div className="text-xs text-gray-500">
                      Experience: <span className="text-gray-700">{f.exp} years</span>
                    </div>
                  )}
                </div>
                <span className="mt-4 flex items-center gap-1.5 text-xs text-[#C8201A]">
                  View profile →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
