import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOpenVacancies } from "@/lib/actions/recruitment";

export const metadata: Metadata = { title: "Faculty Vacancies" };

export default async function CareersPage() {
  const result = await getOpenVacancies();
  const vacancies = result.ok ? result.data : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><Link href="/" className="hover:text-blue-700">Home</Link></li>
          <li>/</li>
          <li aria-current="page">Faculty Vacancies</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Vacancies</h1>
      <p className="text-gray-500 mb-4">
        Join our team of distinguished educators committed to academic excellence at Ramakrishna Mission College, Narayanpur.
      </p>
      <p className="text-sm mb-10">
        <Link href="/careers/dashboard" className="text-[#C8201A] font-semibold hover:underline">
          Track your faculty applications →
        </Link>
      </p>

      {vacancies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-blue-100">
          <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No open vacancies at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {vacancies.map((v) => {
            const dept = (v.departments as { name?: string } | undefined)?.name;
            return (
              <Card key={v.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-semibold text-gray-900">
                        <Link href={`/careers/${v.id}`} className="hover:text-[#0D2660] hover:underline">{v.title}</Link>
                      </h2>
                      {v.designation && <Badge variant="secondary" className="text-xs">{v.designation}</Badge>}
                    </div>
                    {v.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{v.description}</p>}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                      {dept && <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" aria-hidden="true" />{dept}</span>}
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />On-campus</span>
                      {v.closes_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          Closes: {new Date(v.closes_at).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button asChild className="bg-[#0D2660] text-white hover:bg-[#071540] shrink-0">
                    <Link href={`/careers/apply/${v.id}`}>Apply Now</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
