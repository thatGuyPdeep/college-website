import Link from "next/link";
import { requirePermission } from "@/lib/auth/helpers";
import { AdminSearchClient } from "@/components/admin/AdminSearchClient";

export default async function AdminSearchPage() {
  await requirePermission("dashboard", "view");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:text-[#0D2660]">Admin</Link> / Search
      </nav>
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Admin Search</h1>
      <p className="text-sm text-gray-500 mb-8">Search across modules you have access to.</p>
      <AdminSearchClient />
    </div>
  );
}
