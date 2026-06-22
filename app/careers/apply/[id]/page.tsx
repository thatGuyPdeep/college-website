import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getVacancyById } from "@/lib/actions/recruitment";
import { FacultyApplyForm } from "@/components/recruitment/FacultyApplyForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Apply for Faculty Position" };

export default async function FacultyApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/careers/apply/${id}`);

  const result = await getVacancyById(id);
  if (!result.ok) notFound();
  const vacancy = result.data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><Link href="/" className="hover:text-[#0D2660]">Home</Link></li>
          <li>/</li>
          <li><Link href="/careers" className="hover:text-[#0D2660]">Careers</Link></li>
          <li>/</li>
          <li aria-current="page">Apply</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-[#0D2660] mb-1">{vacancy.title}</h1>
      <p className="text-gray-500 text-sm mb-8">{vacancy.designation} · Complete the form below</p>
      <FacultyApplyForm vacancy={vacancy} />
    </div>
  );
}
