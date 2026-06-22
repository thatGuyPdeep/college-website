"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdmissionsSearchBar({ defaultQuery }: { defaultQuery?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = (fd.get("q") as string)?.trim() ?? "";
    const next = new URLSearchParams();
    if (status) next.set("status", status);
    if (q) next.set("q", q);
    router.push(`/admin/admissions${next.toString() ? `?${next}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-6 max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
        <Input
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search name, email, app no…"
          className="pl-9"
          aria-label="Search applications"
        />
      </div>
      <Button type="submit" variant="outline" className="border-[#0D2660] text-[#0D2660]">Search</Button>
    </form>
  );
}
