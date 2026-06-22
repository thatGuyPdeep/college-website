import { Suspense } from "react";
import { MfaSetup } from "@/components/auth/MfaSetup";

export const metadata = { title: "Two-Factor Authentication" };

export default function MfaPage() {
  return (
    <div className="section bg-white min-h-[60vh] flex items-center">
      <div className="container-site w-full">
        <Suspense fallback={<p className="text-center text-gray-400">Loading…</p>}>
          <MfaSetup />
        </Suspense>
      </div>
    </div>
  );
}
