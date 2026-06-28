import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen, Users } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PEOPLE_HUB_SECTIONS } from "@/lib/content/portal-hubs";
import { getPublicFaculty } from "@/lib/content/public-data";
import { LEADERSHIP_PROFILES } from "@/lib/content/leadership-profiles";
import { DEPARTMENTS, getDepartmentBySlug } from "@/lib/content/departments";
import { getStaffDirectory } from "@/lib/actions/staff-directory";
import { staffForDepartmentFromList } from "@/lib/content/staff-directory";

const VALID = new Set<string>(PEOPLE_HUB_SECTIONS.map((s) => s.slug));

export async function generateStaticParams() {
  return PEOPLE_HUB_SECTIONS.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const meta = PEOPLE_HUB_SECTIONS.find((s) => s.slug === section);
  return { title: meta?.label ?? "People" };
}

export default async function PeopleSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ dept?: string }>;
}) {
  const { section } = await params;
  const { dept } = await searchParams;
  if (!VALID.has(section)) notFound();

  const meta = PEOPLE_HUB_SECTIONS.find((s) => s.slug === section)!;
  const deptInfo = dept ? getDepartmentBySlug(dept) : null;
  const staffList = section === "staff" ? await getStaffDirectory() : [];

  return (
    <>
      <PageHero
        eyebrow="People"
        title={meta.label}
        description={meta.description}
      />
      <section className="section bg-white">
        <div className="container-site max-w-7xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/people">People</Link> / {meta.label}
            {deptInfo && <> / {deptInfo.name}</>}
          </nav>

          {deptInfo && (
            <p className="text-sm text-gray-600 mb-6">
              Filtered for{" "}
              <Link href={`/academics/departments/${dept}`} className="font-semibold text-[#0D2660] hover:underline">
                {deptInfo.name}
              </Link>
              {" · "}
              <Link href={`/people/${section}`} className="text-[#C8201A] hover:underline">
                Show all
              </Link>
            </p>
          )}

          {section === "faculty" && <FacultyList deptFilter={deptInfo?.name} />}
          {section === "staff" && <StaffDirectory deptSlug={dept} deptInfo={deptInfo} staffList={staffList} />}
          {section === "students" && <StudentsInfo />}
          {section === "authorities" && <AuthoritiesList />}
        </div>
      </section>
    </>
  );
}

async function FacultyList({ deptFilter }: { deptFilter?: string }) {
  let faculty = await getPublicFaculty();
  if (deptFilter) {
    const needle = deptFilter.toLowerCase();
    faculty = faculty.filter((f) => f.dept.toLowerCase().includes(needle.split(" ")[0] ?? needle));
  }

  if (faculty.length === 0) {
    return (
      <p className="text-gray-600">
        Faculty directory is being updated. See also{" "}
        <Link href="/faculty" className="text-[#C8201A] font-semibold hover:underline">
          full faculty page
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {faculty.map((f) => (
        <Link
          key={f.id}
          href={`/faculty/${f.id}`}
          className="block bg-white border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4 mb-4">
            {f.photo_url ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image src={f.photo_url} alt={f.name} fill className="object-cover" sizes="56px" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0D2660] to-[#C8201A] flex items-center justify-center text-white font-bold text-lg shrink-0">
                {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-900 leading-tight">{f.name}</h2>
              <p className="text-sm text-[#0D2660]">{f.designation}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.dept}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="h-3.5 w-3.5 text-gray-400" />
            {f.qual}
          </div>
        </Link>
      ))}
    </div>
  );
}

function StaffDirectory({
  deptSlug,
  deptInfo,
  staffList,
}: {
  deptSlug?: string;
  deptInfo?: { name: string } | null;
  staffList: import("@/lib/content/staff-directory").StaffMember[];
}) {
  const staff = deptSlug ? staffForDepartmentFromList(deptSlug, staffList) : staffList;

  return (
    <div>
      {deptInfo && (
        <p className="text-sm text-gray-600 mb-6">
          Support staff associated with {deptInfo.name}.
        </p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((s) => (
          <article key={s.id} className="p-5 rounded-xl border border-blue-100 bg-white shadow-sm">
            <h2 className="font-semibold text-[#0D2660]">{s.name}</h2>
            <p className="text-sm text-[#C8201A]">{s.designation}</p>
            <p className="text-xs text-gray-500 mt-1">{s.department}</p>
            {s.phone && <p className="text-sm text-gray-600 mt-3">{s.phone}</p>}
            {s.email && (
              <a href={`mailto:${s.email}`} className="text-sm text-[#0D2660] hover:underline block mt-1">
                {s.email}
              </a>
            )}
          </article>
        ))}
      </div>
      <Link href="/contact" className="inline-block mt-8 text-sm font-semibold text-[#C8201A] hover:underline">
        Contact office →
      </Link>
    </div>
  );
}

function StudentsInfo() {
  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-gray-600 leading-relaxed">
        Over 2,700 students receive value-based education across undergraduate programmes, ITI trades,
        and allied Mission schools — primarily from tribal communities of Abujhmarh.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/students-corner" className="p-5 rounded-xl border border-blue-100 bg-[#F0F4FF] hover:border-[#0D2660]/30">
          <Users className="h-6 w-6 text-[#0D2660] mb-2" />
          <span className="font-semibold text-[#0D2660]">Students&apos; Corner</span>
        </Link>
        <Link href="/login?redirect=/student" className="p-5 rounded-xl border border-blue-100 bg-[#F0F4FF] hover:border-[#0D2660]/30">
          <span className="font-semibold text-[#0D2660]">Student ERP Login</span>
          <p className="text-xs text-gray-500 mt-1">Attendance · Marks · Timetable</p>
        </Link>
      </div>
      <div>
        <h2 className="font-semibold text-[#0D2660] mb-3">Departments</h2>
        <ul className="space-y-2">
          {DEPARTMENTS.map((d) => (
            <li key={d.slug}>
              <Link href={`/academics/departments/${d.slug}`} className="text-[#0D2660] hover:underline">
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AuthoritiesList() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {LEADERSHIP_PROFILES.map((p) => (
        <Link
          key={p.slug}
          href={`/about/leadership/${p.slug}`}
          className="block rounded-xl border border-blue-100 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative h-40 bg-gray-100">
            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="400px" />
          </div>
          <div className="p-5">
            <h2 className="font-semibold text-[#0D2660]">{p.name}</h2>
            <p className="text-sm text-[#C8201A]">{p.title}</p>
            <p className="text-xs text-gray-500 mt-1">{p.org}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
