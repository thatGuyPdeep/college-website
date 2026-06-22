"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Vacancy = { id: string; title: string; status: string };

export function RecruitmentVacancyFilter({ vacancies }: { vacancies: Vacancy[] }) {
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const vacancyId = params.get("vacancy_id") ?? "";

  function hrefFor(vId: string) {
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    if (vId) q.set("vacancy_id", vId);
    const qs = q.toString();
    return `/admin/recruitment${qs ? `?${qs}` : ""}`;
  }

  const open = vacancies.filter((v) => v.status === "open");

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs text-gray-500 font-medium">Vacancy:</span>
      <Link
        href={hrefFor("")}
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          !vacancyId ? "bg-[#0D2660] text-white border-[#0D2660]" : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        All
      </Link>
      {open.map((v) => (
        <Link
          key={v.id}
          href={hrefFor(v.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium border max-w-[200px] truncate ${
            vacancyId === v.id ? "bg-[#0D2660] text-white border-[#0D2660]" : "bg-white text-gray-600 border-gray-200"
          }`}
          title={v.title}
        >
          {v.title}
        </Link>
      ))}
    </div>
  );
}
