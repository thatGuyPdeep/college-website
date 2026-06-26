import Link from "next/link";
import { requirePermission } from "@/lib/auth/helpers";
import { getSeatMatrixOverrides } from "@/lib/actions/site-settings";
import { SeatMatrixEditor } from "@/components/admin/SeatMatrixEditor";

export default async function AdminSeatMatrixPage() {
  await requirePermission("admissions", "edit");
  const overrides = await getSeatMatrixOverrides();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:text-[#0D2660]">Admin</Link>
        {" / "}
        <Link href="/admin/admissions" className="hover:text-[#0D2660]">Admissions</Link>
        {" / Seats"}
      </nav>
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Seat Matrix Editor</h1>
      <p className="text-sm text-gray-500 mb-8">
        Overrides appear on the public{" "}
        <Link href="/admissions/seats" className="text-[#C8201A] hover:underline">seats availability</Link> page.
      </p>
      <SeatMatrixEditor initial={overrides} />
    </div>
  );
}
