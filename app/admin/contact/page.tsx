import { requirePermission } from "@/lib/auth/helpers";
import { listContactEnquiries } from "@/lib/actions/admin-contact";
import { EnquiryList } from "@/components/admin/EnquiryList";
import { ContactEnquiryFilter } from "@/components/admin/ContactEnquiryFilter";
import { Suspense } from "react";

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: "new" | "read"; grievance?: string }>;
}) {
  await requirePermission("contact", "view");
  const { status, grievance } = await searchParams;
  const result = await listContactEnquiries({
    status: status === "new" || status === "read" ? status : undefined,
    grievance: grievance === "1",
  });
  const items = result.ok ? result.data : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Contact Enquiries</h1>
      <p className="text-sm text-gray-500 mb-6">Messages submitted via the website contact form</p>
      <Suspense fallback={null}>
        <ContactEnquiryFilter />
      </Suspense>
      {!result.ok && (
        <p className="text-amber-700 text-sm mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          {result.error}. Run migration 005 in Supabase if the contact_enquiries table is missing.
        </p>
      )}
      <EnquiryList items={items} />
    </div>
  );
}
