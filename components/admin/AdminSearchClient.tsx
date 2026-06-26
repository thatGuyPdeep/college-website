"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminGlobalSearch, type AdminSearchResult } from "@/lib/actions/admin-search";

const TYPE_LABELS: Record<AdminSearchResult["type"], string> = {
  application:         "Application",
  contact:             "Contact",
  faculty_application: "Recruitment",
  news:                "Content",
};

export function AdminSearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminSearchResult[]>([]);
  const [pending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await adminGlobalSearch(query);
      if (res.ok) setResults(res.data);
    });
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applications, contact, recruitment, news…"
            className="pl-10"
            minLength={2}
          />
        </div>
        <button
          type="submit"
          disabled={pending || query.length < 2}
          className="px-5 py-2 rounded-lg bg-[#0D2660] text-white text-sm font-medium disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {results.length === 0 && query.length >= 2 && !pending ? (
        <p className="text-sm text-gray-400">No results for &ldquo;{query}&rdquo;</p>
      ) : (
        <ul className="divide-y divide-blue-50 bg-white rounded-xl border border-blue-100">
          {results.map((r, i) => (
            <li key={`${r.type}-${i}`}>
              <Link href={r.href} className="block px-5 py-4 hover:bg-blue-50/40">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#C8201A]">
                  {TYPE_LABELS[r.type]}
                </span>
                <p className="font-medium text-gray-900 mt-0.5">{r.title}</p>
                {r.subtitle && <p className="text-xs text-gray-500 mt-0.5">{r.subtitle}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
