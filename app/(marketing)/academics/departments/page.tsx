import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/content/departments";

export const metadata: Metadata = { title: "Departments" };

const DEPARTMENTS_LIST = DEPARTMENTS;

export default function DepartmentsPage() {
  return (
    <>
      <PageHero eyebrow="Academics" title="Departments" description="Academic departments at Ramakrishna Mission Vivekananda College, affiliated to Bastar University." />
      <section className="section bg-white">
        <div className="container-site max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <ol className="flex gap-2">
              <li><Link href="/">Home</Link></li><li>/</li>
              <li><Link href="/academics">Academics</Link></li><li>/</li>
              <li aria-current="page">Departments</li>
            </ol>
          </nav>
          <div className="space-y-5">
            {DEPARTMENTS_LIST.map((dept) => (
              <Card key={dept.slug} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-[#0D2660] mb-2">
                    <Link href={`/academics/departments/${dept.slug}`} className="hover:underline">{dept.name}</Link>
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">{dept.overview}</p>
                  {dept.programs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {dept.programs.map((p) => (
                        <Link key={p} href="/academics" className="text-xs bg-blue-50 text-[#0D2660] px-3 py-1 rounded-full hover:bg-blue-100">
                          {p}
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-8">
            Also explore programmes and ITI trades on the{" "}
            <Link href="/academics" className="text-[#C8201A] font-semibold hover:underline">Academics page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
