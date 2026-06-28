import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Time Table" };

const LINKS = [
  { label: "Examination Time Tables", href: "/examination/timetables", desc: "University exam schedules" },
  { label: "Academic Calendar", href: "/academics/calendar", desc: "Semester dates and holidays" },
  { label: "Student ERP Timetable", href: "/login?redirect=/student/timetable", desc: "Class timetable (login required)" },
  { label: "Department Pages", href: "/academics/departments", desc: "Department-wise notices and links" },
];

export default function TimetableHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Time Table"
        description="Class schedules, examination timetables, and academic calendar."
      />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / Time Table
          </nav>
          <ul className="space-y-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block p-5 rounded-xl border border-blue-100 hover:border-[#0D2660]/30 bg-white"
                >
                  <span className="font-semibold text-[#0D2660]">{l.label}</span>
                  <p className="text-sm text-gray-500 mt-1">{l.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
