import Link from "next/link";

const PEOPLE_SECTIONS = [
  { label: "Faculty", href: "/people/faculty", query: "" },
  { label: "Staff", href: "/people/staff", query: "" },
  { label: "Students", href: "/people/students", query: "" },
  { label: "Authorities", href: "/people/authorities", query: "" },
] as const;

export function DeptPeopleLinks({ deptSlug }: { deptSlug: string; deptName?: string }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-[#0D2660] mb-4">People</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {PEOPLE_SECTIONS.map((s) => (
          <Link
            key={s.label}
            href={`${s.href}?dept=${deptSlug}`}
            className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-[#F0F4FF] hover:border-[#0D2660]/30 text-sm font-semibold text-[#0D2660] transition-colors"
          >
            {s.label}
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
