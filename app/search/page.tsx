import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading search…</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
