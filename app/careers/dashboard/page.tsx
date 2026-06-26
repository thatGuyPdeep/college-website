import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyFacultyApplications } from "@/lib/actions/recruitment";
import { createClient } from "@/lib/supabase/server";
import { CareersStatusTracker } from "@/components/recruitment/CareersStatusTracker";

export default async function CareersDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/careers/dashboard");

  const params = await searchParams;
  const justSubmitted = params.submitted === "1";

  const result = await getMyFacultyApplications();
  const apps = result.ok ? result.data : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2660]">Faculty Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Track your recruitment applications</p>
        </div>
        <Button asChild className="bg-[#0D2660] text-white">
          <Link href="/careers">View Vacancies</Link>
        </Button>
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-blue-100">
          <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">You haven&apos;t applied for any faculty positions yet.</p>
          <Button asChild variant="outline"><Link href="/careers">Browse Vacancies</Link></Button>
        </div>
      ) : (
        <CareersStatusTracker initialApps={apps} justSubmitted={justSubmitted} />
      )}
    </div>
  );
}
