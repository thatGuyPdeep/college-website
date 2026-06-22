import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { getExplorerPrograms } from "@/lib/content/programs";

export const metadata: Metadata = { title: "Fee Structure" };

export default async function FeesPage() {
  const programs = await getExplorerPrograms();
  const withFees = programs.filter((p) => p.fees != null);

  return (
    <>
      <PageHero eyebrow="Admissions" title="Fee Structure" description="Indicative annual fees for UG programmes. Confirm with the admissions office before payment." />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/admissions">Admissions</Link> / Fee Structure
          </nav>

          {withFees.length > 0 ? (
            <div className="table-responsive mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0D2660] text-white text-left">
                    <th className="px-4 py-3 font-semibold">Programme</th>
                    <th className="px-4 py-3 font-semibold">Annual Fee (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {withFees.map((p, i) => (
                    <tr key={p.id} className={i % 2 ? "bg-blue-50/40" : "bg-white"}>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.fees!.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-sm mb-8">
              Detailed fee structure will be published in the prospectus. Contact the admissions office for current fees.
            </p>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-gray-700 space-y-2">
            <p><strong>Application fee:</strong> ₹{process.env.APPLICATION_FEE_INR ?? "500"} (non-refundable, paid online during application).</p>
            <p><strong>Refund policy:</strong> Tuition fee refunds follow university and state government norms. Withdrawal before commencement may qualify for partial refund; no refund after classes begin except as per policy.</p>
            <p>Enquiries: <Link href="/contact" className="text-[#C8201A] font-semibold hover:underline">Contact us</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
