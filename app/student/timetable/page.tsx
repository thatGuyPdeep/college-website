import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getErpPageData } from "@/lib/actions/erp";

export const metadata: Metadata = { title: "Timetable" };

const DAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function TimetablePage() {
  const data = await getErpPageData();
  if (!data.ok) redirect("/login?redirect=/student/timetable");

  const { timetable } = data;

  return (
    <>
      <h1 className="text-xl font-bold text-[#0D2660] mb-6">Class Timetable</h1>
      {timetable.length === 0 ? (
        <p className="text-sm text-gray-500">Timetable not published yet for your programme.</p>
      ) : (
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const slots = timetable.filter((t) => t.day_of_week === day);
            if (slots.length === 0) return null;
            return (
              <div key={day}>
                <h2 className="font-semibold text-gray-800 mb-2">{DAYS[day]}</h2>
                <ul className="space-y-2">
                  {slots.map((t) => (
                    <li key={t.id} className="flex flex-wrap justify-between gap-2 border border-blue-50 rounded-lg px-4 py-3 text-sm">
                      <span className="font-medium">{t.subject}</span>
                      <span className="text-gray-500">
                        {t.start_time?.slice(0, 5)}–{t.end_time?.slice(0, 5)}
                        {t.room && ` · ${t.room}`}
                        {t.faculty_name && ` · ${t.faculty_name}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
