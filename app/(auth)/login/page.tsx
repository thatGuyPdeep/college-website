"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  RKM_LOGO_URL,
  SITE_FULL_NAME,
  SITE_LOCATION,
  SITE_TAGLINE,
  SITE_TAGLINE_EN,
} from "@/lib/utils/constants";
import { cn } from "@/lib/utils";

const PORTAL_FEATURES = [
  { icon: LayoutDashboard, text: "Track your admission application" },
  { icon: GraduationCap, text: "Access the student ERP portal" },
  { icon: ShieldCheck, text: "Secure sign-in with email OTP" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admissions/dashboard";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [provider, setProvider] = useState<"custom" | "supabase" | "dev">("custom");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const supabase = createClient();

  function resetOtpFlow() {
    setSent(false);
    setOtp("");
    setProvider("custom");
    setDevOtp(null);
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setDevOtp(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        provider?: "custom" | "supabase" | "dev";
        devOtp?: string;
      };
      if (!res.ok) {
        toast.error(data.error ?? "Failed to send OTP");
        return;
      }
      setProvider(data.provider ?? "custom");
      if (data.devOtp) setDevOtp(data.devOtp);
      setSent(true);
      if (data.provider === "dev") {
        toast.message("Development mode", {
          description: "Email could not be delivered — use the code shown below.",
        });
      } else {
        toast.success("6-digit code sent to your email!");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      if (provider === "supabase") {
        const { error: sessionErr } = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: otp,
          type: "email",
        });
        if (sessionErr) {
          toast.error(sessionErr.message);
          return;
        }
      } else {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), code: otp }),
        });
        const data = (await res.json()) as { ok?: boolean; token_hash?: string; error?: string };
        if (!res.ok) {
          toast.error(data.error ?? "Invalid code");
          return;
        }

        const { error: sessionErr } = await supabase.auth.verifyOtp({
          token_hash: data.token_hash!,
          type: "magiclink" as const,
        });
        if (sessionErr) {
          toast.error(sessionErr.message);
          return;
        }
      }

      toast.success("Logged in successfully!");
      router.push(redirectTo);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FFFDF9]">
      {/* Brand panel */}
      <div className="relative lg:w-[44%] xl:w-[42%] navy-gradient text-white overflow-hidden">
        <div className="gold-gradient absolute top-0 left-0 right-0 h-1 z-10" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #F5C200 0%, transparent 45%), radial-gradient(circle at 80% 80%, #C8201A 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col justify-between min-h-[220px] lg:min-h-screen px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-200 hover:text-[#F5C200] transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to website
          </Link>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left my-8 lg:my-0 lg:flex-1 lg:justify-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 drop-shadow-2xl mb-6">
              <Image
                src={RKM_LOGO_URL}
                alt="Ramakrishna Mission Emblem"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 128px, 144px"
                priority
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">{SITE_FULL_NAME}</h2>
            <p className="text-blue-300 text-sm mt-1">{SITE_LOCATION}</p>
            <p className="devanagari text-base sm:text-lg mt-4 text-[#F5C200]">{SITE_TAGLINE}</p>
            <p className="text-xs text-blue-300/90 italic mt-1 max-w-sm">{SITE_TAGLINE_EN}</p>

            <ul className="hidden lg:flex flex-col gap-3 mt-10 w-full max-w-sm">
              {PORTAL_FEATURES.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-blue-100"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5C200]/20 text-[#F5C200]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="hidden lg:block text-sm text-blue-200/90 border-l-2 border-[#F5C200] pl-4 max-w-sm">
            &ldquo;Arise, awake and stop not till the goal is reached.&rdquo;
            <footer className="text-xs text-[#F5C200] mt-2 font-semibold not-italic">— Swami Vivekananda</footer>
          </blockquote>
        </div>

        <div className="gold-gradient absolute bottom-0 left-0 right-0 h-1 z-10" aria-hidden="true" />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Step indicator */}
          <ol className="flex items-center gap-2 mb-8" aria-label="Sign-in progress">
            {[
              { step: 1, label: "Email" },
              { step: 2, label: "Verify" },
            ].map(({ step, label }, i) => {
              const active = sent ? step === 2 : step === 1;
              const done = sent && step === 1;
              return (
                <li key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors",
                      done && "bg-green-100 border-green-500 text-green-700",
                      active && !done && "bg-[#0D2660] border-[#0D2660] text-white",
                      !active && !done && "bg-white border-blue-200 text-gray-400",
                    )}
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : step}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:inline",
                      active ? "text-[#0D2660]" : "text-gray-400",
                    )}
                  >
                    {label}
                  </span>
                  {i === 0 && <span className="flex-1 h-px bg-blue-100 mx-1" aria-hidden="true" />}
                </li>
              );
            })}
          </ol>

          <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-900/5 p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F4FF] text-[#0D2660]">
                {sent ? (
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Mail className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0D2660] leading-tight">
                  {sent ? "Verify your email" : "Sign in to your account"}
                </h1>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {sent
                    ? provider === "dev"
                      ? `Enter the code for ${email}`
                      : `We sent a 6-digit code to ${email}`
                    : "Applicants and students — use the email linked to your application."}
                </p>
              </div>
            </div>

            {!sent ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-[#0D2660] font-medium">
                    Email address
                  </Label>
                  <div className="relative mt-1.5">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10 min-h-11 focus-visible:ring-[#0D2660]"
                      required
                      autoFocus
                      autoComplete="email"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full min-h-11 bg-[#C8201A] hover:bg-[#9B1812] text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? "Sending code…" : "Send verification code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <Label htmlFor="otp" className="text-[#0D2660] font-medium">
                    6-digit code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="mt-1.5 min-h-14 text-center text-2xl sm:text-3xl tracking-[0.45em] font-mono focus-visible:ring-[#0D2660]"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Check inbox and spam. Code expires in 10 minutes.
                  </p>
                  {devOtp && (
                    <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
                      Development fallback — your code is{" "}
                      <strong className="font-mono tracking-widest">{devOtp}</strong>
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full min-h-11 bg-[#0D2660] hover:bg-[#071540] text-white font-semibold"
                  disabled={loading || otp.length < 6}
                >
                  {loading ? "Verifying…" : "Verify & sign in"}
                </Button>
                <button
                  type="button"
                  onClick={resetOtpFlow}
                  className="w-full text-sm text-[#C8201A] hover:underline text-center py-1"
                >
                  Use a different email
                </button>
              </form>
            )}

            <div className="gold-gradient h-px rounded-full my-6" aria-hidden="true" />

            <div className="grid sm:grid-cols-2 gap-3 text-center text-sm">
              <Link
                href="/admissions/apply"
                className="rounded-xl border border-blue-100 bg-[#F0F4FF]/60 px-4 py-3 text-[#0D2660] font-medium hover:bg-[#F0F4FF] transition-colors"
              >
                New applicant? Apply now
              </Link>
              <Link
                href="/careers"
                className="rounded-xl border border-blue-100 px-4 py-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Faculty careers
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href="/privacy" className="text-[#0D2660] hover:underline">
              Privacy Policy
            </Link>
            . We use OTP for secure, passwordless access.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF] text-[#0D2660] text-sm">
          Loading sign-in…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
