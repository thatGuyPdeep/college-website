"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "@/lib/search/site-index";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "page", label: "Pages" },
  { value: "program", label: "Programmes" },
  { value: "admission", label: "Admissions" },
  { value: "news", label: "News" },
];

export function SearchPageClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery]       = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [loading, setLoading]   = useState(false);

  const runSearch = useCallback(async (q: string, cat: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ q });
      if (cat !== "all") params.set("category", cat);
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json() as { results: SearchResult[] };
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(query, category);
  }, [query, category, runSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ q: query });
    if (category !== "all") params.set("category", category);
    router.replace(`/search?${params}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-6">Search</h1>
      <form onSubmit={handleSubmit} className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search programmes, pages, admissions…"
          className="pl-10 min-h-11"
          autoFocus
          aria-label="Search query"
        />
      </form>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              category === c.value
                ? "bg-[#0D2660] text-white border-[#0D2660]"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {loading && <p className="text-sm text-gray-400">Searching…</p>}
      {!loading && query && results.length === 0 && (
        <p className="text-gray-500">No results for &ldquo;{query}&rdquo;</p>
      )}
      <ul className="space-y-3">
        {results.map((r) => (
          <li key={r.href + r.title}>
            <Link href={r.href} className="block bg-white rounded-xl border border-blue-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#0D2660]">{r.title}</span>
                <Badge variant="secondary" className="text-[10px]">{r.category}</Badge>
              </div>
              <p className="text-sm text-gray-600">{r.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
