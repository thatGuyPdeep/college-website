"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type SearchHit = { title: string; href: string; category: string; excerpt: string };

export function SearchAutocomplete() {
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapRef               = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults((data.results ?? []).slice(0, 6));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchResults(query), 200);
    return () => clearTimeout(t);
  }, [query, fetchResults]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative hidden sm:block">
      <form onSubmit={onSubmit} role="search">
        <label htmlFor="header-search" className="sr-only">Search website</label>
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-[#0D2660]">
          <Search className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
          <input
            id="header-search"
            type="search"
            placeholder="Search…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="w-36 lg:w-44 text-sm bg-transparent outline-none py-1"
            autoComplete="off"
          />
        </div>
      </form>

      {open && query.length >= 2 && (
        <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-blue-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {loading && <p className="px-4 py-3 text-xs text-gray-400">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-xs text-gray-400">No results</p>
          )}
          {!loading && results.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 hover:bg-blue-50 border-b border-blue-50 last:border-0"
            >
              <span className="text-sm font-medium text-gray-800 line-clamp-1">{r.title}</span>
              <span className="text-xs text-gray-400">{r.category}</span>
            </Link>
          ))}
          {query.length >= 2 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-xs text-center text-[#0D2660] font-semibold bg-blue-50 hover:bg-blue-100"
            >
              View all results
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
