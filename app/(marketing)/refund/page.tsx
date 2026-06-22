import type { Metadata } from "next";
import Link from "next/link";
import { REFUND_POLICY } from "@/lib/content/legal-pages";

export const metadata: Metadata = { title: "Refund and Cancellation Policy" };

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><Link href="/" className="hover:text-[#0D2660]">Home</Link></li>
          <li>/</li>
          <li aria-current="page">Refund Policy</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold text-[#0D2660] mb-8">{REFUND_POLICY.title}</h1>
      <div className="space-y-8 text-gray-700 leading-relaxed">
        {REFUND_POLICY.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{s.heading}</h2>
            <p className="text-sm">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
