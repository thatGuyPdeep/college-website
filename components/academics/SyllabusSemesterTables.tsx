import Link from "next/link";
import type { SyllabusSemester } from "@/lib/content/syllabus";
import { getSyllabusForDepartment } from "@/lib/content/syllabus";

export function SyllabusSemesterTables({ semesters }: { semesters: SyllabusSemester[] }) {
  return (
    <div className="space-y-8">
      {semesters.map((sem) => (
        <section key={sem.semester}>
          <h3 className="text-base font-bold text-[#0D2660] mb-3">
            Semester {sem.semester}
            {sem.note && <span className="text-sm font-normal text-gray-500 ml-2">({sem.note})</span>}
          </h3>
          <div className="overflow-x-auto rounded-xl border border-blue-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D2660] text-white text-left">
                  <th className="px-3 py-2 font-semibold">Code</th>
                  <th className="px-3 py-2 font-semibold">Course</th>
                  <th className="px-3 py-2 font-semibold hidden sm:table-cell">Type</th>
                  <th className="px-3 py-2 font-semibold hidden md:table-cell">Credits</th>
                  <th className="px-3 py-2 font-semibold hidden md:table-cell">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {sem.courses.map((c) => (
                  <tr key={`${sem.semester}-${c.code}-${c.title}`} className="hover:bg-blue-50/40">
                    <td className="px-3 py-2 font-mono text-xs text-[#0D2660] whitespace-nowrap">{c.code}</td>
                    <td className="px-3 py-2 text-gray-800">{c.title}</td>
                    <td className="px-3 py-2 text-gray-500 hidden sm:table-cell">{c.type ?? "—"}</td>
                    <td className="px-3 py-2 text-gray-500 hidden md:table-cell">{c.credits ?? "—"}</td>
                    <td className="px-3 py-2 text-gray-500 hidden md:table-cell">{c.marks ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export function DeptQuickLinks({
  deptSlug,
}: {
  deptSlug: string;
  deptName?: string;
}) {
  const syllabus = getSyllabusForDepartment(deptSlug);
  const links = [
    ...(syllabus ? [{ label: "Syllabus", href: `/academics/syllabus/${syllabus.slug}` }] : []),
    { label: "Notices", href: "/news?category=Notice" },
    { label: "Time Tables", href: "/examination/timetables" },
    { label: "Faculty", href: "/faculty" },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-3 mb-10">
      {links.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-[#F0F4FF] hover:border-[#0D2660]/30 text-sm font-semibold text-[#0D2660] transition-colors"
        >
          {l.label}
          <span aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );
}
