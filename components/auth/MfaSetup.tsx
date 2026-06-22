"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function MfaSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [needsVerify, setNeedsVerify] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === "aal2") {
        router.replace(redirect);
        return;
      }
      if (aal?.nextLevel === "aal2" && aal.currentLevel === "aal1") {
        setNeedsVerify(true);
      }
      setLoading(false);
    }
    void check();
  }, [redirect, router]);

  async function startEnroll() {
    setEnrolling(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    setEnrolling(false);
    if (error) { toast.error(error.message); return; }
    setFactorId(data.id);
    setQr(data.totp.qr_code);
    setSecret(data.totp.secret);
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setEnrolling(true);
    const supabase = createClient();
    const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId });
    if (cErr) { toast.error(cErr.message); setEnrolling(false); return; }
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });
    setEnrolling(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Two-factor authentication enabled");
    router.replace(redirect);
    router.refresh();
  }

  async function verifyExisting(e: React.FormEvent) {
    e.preventDefault();
    setEnrolling(true);
    const supabase = createClient();
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.[0];
    if (!totp) { toast.error("No TOTP factor found"); setEnrolling(false); return; }
    const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId: totp.id });
    if (cErr) { toast.error(cErr.message); setEnrolling(false); return; }
    const { error } = await supabase.auth.mfa.verify({
      factorId:     totp.id,
      challengeId:  challenge.id,
      code,
    });
    setEnrolling(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Verified");
    router.replace(redirect);
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Checking authentication…</p>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-bold text-[#0D2660] mb-2">Two-Factor Authentication</h1>
      <p className="text-sm text-gray-600 mb-6">
        Admin accounts require TOTP (authenticator app) for access to the admin console.
      </p>

      {(needsVerify || factorId) && (
        <form onSubmit={needsVerify && !factorId ? verifyExisting : confirmEnroll} className="space-y-4">
          {qr && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="TOTP QR code" className="mx-auto w-48 h-48 border rounded-lg" />
              {secret && <p className="text-xs text-gray-400 mt-2 break-all">Secret: {secret}</p>}
            </div>
          )}
          <Input
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            required
          />
          <Button type="submit" disabled={enrolling} className="w-full bg-[#0D2660] text-white">
            {enrolling ? "Verifying…" : "Verify & Continue"}
          </Button>
        </form>
      )}

      {!needsVerify && !factorId && (
        <Button onClick={() => void startEnroll()} disabled={enrolling} className="bg-[#0D2660] text-white">
          {enrolling ? "Setting up…" : "Set Up Authenticator App"}
        </Button>
      )}
    </div>
  );
}
