import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

describe("otp-config", () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it("treats verified Resend domain as production-ready", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = "College <admissions@rmvk.edu.in>";
    const { hasProductionOtpEmail } = await import("@/lib/email/otp-config");
    expect(hasProductionOtpEmail()).toBe(true);
  });

  it("does not treat Resend test sender as production-ready", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = "College <onboarding@resend.dev>";
    const { hasProductionOtpEmail } = await import("@/lib/email/otp-config");
    expect(hasProductionOtpEmail()).toBe(false);
  });

  it("never allows screen fallback in production", async () => {
    process.env.NODE_ENV = "production";
    process.env.OTP_SCREEN_FALLBACK = "true";
    const { allowDevScreenFallback } = await import("@/lib/email/otp-config");
    expect(allowDevScreenFallback()).toBe(false);
  });
});
