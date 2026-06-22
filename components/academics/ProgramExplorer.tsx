"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ExplorerProgram } from "@/lib/content/programs";

const LEVELS = [
  { value: "all", label: "All levels" },
  { value: "ug", label: "UG" },
  { value: "pg", label: "PG" },
  { value: "diploma", label: "Diploma" },
];

interface Props {
  programs: ExplorerProgram[];
  showApply?: boolean;
}

export function ProgramExplorer({ programs, showApply = true }: Props) {
  const [level, setLevel] = useState("all");
  const [query, setQuery]   = useState("");

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      if (level !== "all" && p.level !== level) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.department?.toLowerCase().includes(q) ?? false) ||
          (p.short?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [programs, level, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search programmes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2660]"
          aria-label="Search programmes"
        />
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => setLevel(l.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                level === l.value
                  ? "bg-[#0D2660] text-white border-[#0D2660]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0D2660]"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm py-8 text-center">No programmes match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <Card key={p.id} className="h-full border-blue-100 card-lift hover:border-[#0D2660]/30">
              <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <BookOpen className="h-5 w-5 text-[#0D2660]" aria-hidden="true" />
                  </div>
                  <span className="text-xs bg-blue-50 text-[#0D2660] font-semibold uppercase px-2 py-1 rounded-md">
                    {p.levelLabel}
                  </span>
                </div>
                <h3 className="font-bold text-[#0D2660] mb-1">
                  <Link href={`/academics/courses/${p.slug}`} className="hover:underline">{p.name}</Link>
                </h3>
                {p.duration && <p className="text-xs text-gray-400 mb-2">{p.duration}</p>}
                {p.department && <p className="text-xs text-gray-500 mb-2">{p.department}</p>}
                {p.short && <p className="text-sm text-gray-600 mb-4 line-clamp-3">{p.short}</p>}
                <div className="mt-auto flex gap-2">
                  <Button asChild size="sm" variant="outline" className="border-[#0D2660] text-[#0D2660]">
                    <Link href={`/academics/courses/${p.slug}`}>Details</Link>
                  </Button>
                  {showApply && (
                    <Button asChild size="sm" className="bg-[#C8201A] hover:bg-[#9B1812] text-white">
                      <Link href="/admissions/apply">Apply</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
